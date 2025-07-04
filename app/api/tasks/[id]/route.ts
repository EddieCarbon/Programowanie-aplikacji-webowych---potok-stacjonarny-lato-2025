import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db.config";
import Task from "@/models/task.model";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  await connect();
  const { id } = await params;
  const {
    name,
    description,
    priority,
    state,
    estimatedHours,
    assignee,
    startedAt,
    finishedAt,
  } = await request.json();
  const updated = await Task.findByIdAndUpdate(
    id,
    {
      name,
      description,
      priority,
      state,
      estimatedHours,
      assignee,
      startedAt,
      finishedAt,
    },
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
  await Task.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
