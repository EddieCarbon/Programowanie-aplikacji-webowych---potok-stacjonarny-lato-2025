import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db.config";
import Task from "@/models/task.model";

export async function GET() {
  await connect();
  const tasks = await Task.find({});
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  await connect();
  const {
    name,
    description,
    priority,
    story,
    estimatedHours,
    state,
    assignee,
  } = await request.json();
  const newTask = new Task({
    name,
    description,
    priority,
    story,
    estimatedHours,
    state,
    assignee,
  });
  const saved = await newTask.save();
  return NextResponse.json(saved, { status: 201 });
}
