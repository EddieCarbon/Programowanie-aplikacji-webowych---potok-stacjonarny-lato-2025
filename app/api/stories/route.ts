import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db.config";
import Story from "@/models/story.model";

export async function GET() {
  await connect();
  const stories = await Story.find({});
  return NextResponse.json(stories);
}

export async function POST(request: NextRequest) {
  await connect();
  const { name, description, priority, project, state, owner } =
    await request.json();
  const newStory = new Story({
    name,
    description,
    priority,
    project,
    state,
    owner,
  });
  const saved = await newStory.save();
  return NextResponse.json(saved, { status: 201 });
}
