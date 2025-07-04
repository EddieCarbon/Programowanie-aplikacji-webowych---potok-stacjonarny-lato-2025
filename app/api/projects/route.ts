import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db.config";
import Project from "@/models/project.model";

export async function GET() {
  await connect();
  const projects = await Project.find({});
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  await connect();
  const { name, description, ownerId } = await request.json();
  const newProject = new Project({ name, description, ownerId });
  const saved = await newProject.save();
  return NextResponse.json(saved, { status: 201 });
}
