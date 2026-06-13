import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CommandHistory from '@/models/CommandHistory';

export async function GET(req: NextRequest) {
  try {
    await connectDB();  // kết nối monggo
    const { searchParams } = new URL(req.url); 
    const status = searchParams.get('status');  // "EXECUTING" hoặc null
    const limit  = Number(searchParams.get('limit') ?? 50);

    const filter = status ? { latestStatus: status } : {};
    const data = await CommandHistory.find(filter) // Tìm trong MongoDB, sắp xếp mới nhất trước, giới hạn số lượng
      .sort({ updatedAt: -1 })
      .limit(limit);

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

//api/commands → lấy 50 lệnh mới nhất
//api/commands?status=FAILED → chỉ lấy lệnh bị lỗi
//api/commands?limit=10 → chỉ lấy 10 lệnh