import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CommandHistory from '@/models/CommandHistory';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ── GET: lấy danh sách lịch sử lệnh ──
// Dùng bởi CommandHistoryTable để hiển thị danh sách command_id + events.
// Hỗ trợ filter theo status (?status=EXECUTING) và limit (?limit=50).
//
// Lưu ý: route này KHÔNG còn xử lý POST nữa.
// Việc ghi dữ liệu (tạo/cập nhật lịch sử lệnh) đã được tách riêng
// sang /api/commands/upsert/route.ts để tránh có 2 đường ghi dữ liệu
// song song, dễ gây duplicate hoặc logic không đồng bộ.
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 0, 1), 200) : 50;

    const query: Record<string, any> = {};
    if (status) query.latestStatus = status;

    const commands = await CommandHistory.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json(commands, { headers: CORS_HEADERS });
  } catch (err: any) {
    console.error('❌ GET /api/commands lỗi:', err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}