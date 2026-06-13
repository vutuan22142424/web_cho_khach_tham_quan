import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CommandHistory from '@/models/CommandHistory';

export async function POST(req: NextRequest) {
  try {
    await connectDB(); // Nhận dữ liệu từ body request
    const { command_id, status, eventId } = await req.json();  // ← thêm eventId
    // Ví dụ: { command_id: "cmd_001", status: "EXECUTING", eventId: "cmd_001_EXECUTING_1234" }

    if (!command_id || !status) // bắt buộc phải có 2 thằng này
      return NextResponse.json({ error: 'Thiếu dữ liệu' }, { status: 400 });

    const filter: Record<string, any> = { command_id }; // tránh trùng 
    if (eventId) {
      filter['events.eventId'] = { $ne: eventId };  // ← chỉ check nếu có eventId
    }

    const result = await CommandHistory.findOneAndUpdate(
      filter,
      {
        $push:        { events: { status, timestamp: new Date(), eventId } },  // ← thêm eventId
        $set:         { latestStatus: status, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true, new: true } // Nếu không tìm thấy → TẠO MỚI document
    );

    return NextResponse.json(result, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}