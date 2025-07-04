import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db.config";
import User from "@/models/user.model";

export async function GET(request: NextRequest) {
  await connect();
  const users = await User.find({});
  return NextResponse.json(users);
}
