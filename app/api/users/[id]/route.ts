import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db.config";
import User from "@/models/user.model";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connect();
  const { id } = await params;
  const user = await User.findById(id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(user);
}
