import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db.config";
import Project from "@/models/project.model";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  await connect();
  const { name, description } = await request.json();
  const { id } = await params;
  const updated = await Project.findByIdAndUpdate(
    id,
    { name, description },
    { new: true },
  );
  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  await connect();
  await Project.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
