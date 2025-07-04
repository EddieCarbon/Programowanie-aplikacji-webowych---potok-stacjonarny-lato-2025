import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db.config";
import Story from "@/models/story.model";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  await connect();
  const { id } = await params;
  const { name, description, priority, state } = await request.json();
  const updated = await Story.findByIdAndUpdate(
    id,
    { name, description, priority, state },
    { new: true },
  );
  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  await connect();
  const { id } = await params;
  await Story.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
