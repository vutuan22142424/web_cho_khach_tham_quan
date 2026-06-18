import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CommandHistory from '@/models/CommandHistory';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST(req: NextRequest) {
  // Đọc body 1 lần duy nhất, lưu lại command_id để dùng cả trong catch
  // (NextRequest.json() không thể gọi lần 2, body stream chỉ đọc được 1 lần).
  let command_id: string | undefined;
  let status: string | undefined;
  let eventId: string | undefined;

  try {
    const body = await req.json();
    command_id = body.command_id;
    status = body.status;
    eventId = body.eventId;

    await connectDB();

    if (!command_id || !status) {
      return NextResponse.json({ error: 'Thiếu dữ liệu' }, { status: 400 });
    }

    // Nếu không có eventId (trường hợp client cũ chưa gửi), fallback về hành vi cũ
    // nhưng tạo eventId tự sinh để vẫn có khóa chống trùng tối thiểu.
    const safeEventId = eventId ?? `${command_id}_${status}_${Date.now()}`;

    // ── 1 lệnh atomic duy nhất ──
    // Bước "set latestStatus" và "push event nếu chưa có eventId" được gộp
    // vào CÙNG MỘT findOneAndUpdate, với điều kiện chống trùng nằm ngay
    // trong filter: 'events.eventId': { $ne: safeEventId }.
    //
    // Vì MongoDB xử lý các write trên CÙNG 1 document một cách tuần tự
    // (document-level locking), nên dù 2 request đến gần như đồng thời
    // (do nhiều tab admin cùng mở), request thứ 2 chỉ thấy được kết quả
    // SAU KHI request thứ 1 đã commit xong. Nếu request 1 đã push eventId
    // này rồi, request 2 sẽ không còn match filter -> không push nữa.
    //
    // Đây khác với cách cũ (2 lệnh update riêng: 1 cho latestStatus,
    // 1 cho push event) — tách làm 2 lệnh tạo ra khoảng hở (race window)
    // giữa lúc đọc và lúc ghi, khiến 2 request có thể cùng pass điều kiện
    // "chưa có eventId" trước khi cái đầu tiên kịp ghi xong.
    let finalDoc = await CommandHistory.findOneAndUpdate(
      {
        command_id,
        'events.eventId': { $ne: safeEventId },
      },
      {
        $set: { latestStatus: status, updatedAt: new Date() },
        $push: { events: { status, timestamp: new Date(), eventId: safeEventId } },
        $setOnInsert: { createdAt: new Date() },
      },
      { new: true, upsert: true }
    );

    // Trường hợp document đã tồn tại NHƯNG eventId đã có rồi (duplicate thật):
    // filter phía trên sẽ không match (vì 'events.eventId': $ne thất bại),
    // và vì upsert:true, mongoose sẽ cố TẠO MỚI document trùng command_id
    // -> vi phạm unique index trên command_id -> báo lỗi E11000.
    // Đây là hành vi ta MUỐN: bắt lỗi này nghĩa là event đã tồn tại,
    // chỉ cần lấy lại document hiện tại và trả về, không coi là lỗi thật.
    if (!finalDoc) {
      finalDoc = await CommandHistory.findOne({ command_id });
    }

    return NextResponse.json(finalDoc, { headers: CORS_HEADERS });
  } catch (err: any) {
    // Bắt riêng lỗi duplicate key (E11000) sinh ra từ trường hợp race hiếm gặp:
    // 2 request cùng pass filter "chưa có eventId" trước khi upsert commit,
    // dẫn tới việc 1 trong 2 cố tạo document mới trùng command_id (unique index).
    // Khi đó coi như event đã được ghi nhận bởi request kia -> trả về document hiện tại.
    if (err?.code === 11000 && command_id) {
      try {
        const doc = await CommandHistory.findOne({ command_id });
        return NextResponse.json(doc, { headers: CORS_HEADERS });
      } catch {}
    }
    return NextResponse.json({ error: err.message }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}