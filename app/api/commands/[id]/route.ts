import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CommandHistory from '@/models/CommandHistory';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ← thêm Promise
) {
  try {
    const { id } = await params; // ← thêm await
    await connectDB();
    await CommandHistory.findByIdAndDelete(id); // ← dùng id thay params.id
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}