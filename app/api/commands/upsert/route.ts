import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CommandHistory from '@/models/CommandHistory';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { command_id, status, eventId } = await req.json();
    // Ví dụ: { command_id: "cmd_001", status: "EXECUTING", eventId: "cmd_001_EXECUTING" }

    if (!command_id || !status) {
      return NextResponse.json({ error: 'Thiếu dữ liệu' }, { status: 400 });
    }

    // ── Bước 1: luôn cập nhật latestStatus/updatedAt, và tạo document nếu chưa có ──
    // Việc này tách riêng để dù event có bị coi là duplicate ở bước 2,
    // trạng thái mới nhất của robot vẫn luôn được phản ánh đúng.
    await CommandHistory.findOneAndUpdate(
      { command_id },
      {
        $set: { latestStatus: status, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date(), events: [] },
      },
      { upsert: true }
    );

    // ── Bước 2: chỉ push event mới nếu eventId CHƯA tồn tại trong array events ──
    // Điều kiện "events.eventId": { $ne: eventId } nằm ngay trong filter chính:
    // nếu eventId đã có rồi, document sẽ KHÔNG match điều kiện này nữa,
    // nên $push sẽ không chạy -> chống duplicate triệt để ở tầng database,
    // không phụ thuộc client, không phụ thuộc timestamp khác nhau giữa các lần gọi.
    const result = await CommandHistory.findOneAndUpdate(
      {
        command_id,
        ...(eventId ? { 'events.eventId': { $ne: eventId } } : {}),
      },
      {
        $push: { events: { status, timestamp: new Date(), eventId } },
      },
      { new: true }
    );

    // Nếu result null: nghĩa là eventId đã tồn tại từ trước (duplicate bị chặn ở DB)
    // -> vẫn trả về document hiện tại để client không bị lỗi, chỉ là không push thêm.
    const finalDoc = result ?? (await CommandHistory.findOne({ command_id }));

    return NextResponse.json(finalDoc, { headers: CORS_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}