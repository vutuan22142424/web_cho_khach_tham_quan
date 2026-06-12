import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CommandHistory from '@/models/CommandHistory';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit  = Number(searchParams.get('limit') ?? 50);

    const filter = status ? { latestStatus: status } : {};
    const data = await CommandHistory.find(filter)
      .sort({ updatedAt: -1 })
      .limit(limit);

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}