import { get } from "http";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = cookies().get("user")?.value;
  console.log(user);
  return NextResponse.json(user ? JSON.parse(user) : null);
}

export async function POST(req: NextRequest) {
  cookies().set("user", JSON.stringify(req.body));
}

export async function PUT(req: NextRequest) {
  cookies().set("user", JSON.stringify(req.body));
  return NextResponse.json(req.body);
}

export async function DELETE(req: NextRequest) {
  cookies().delete("user");
  return NextResponse.json({ message: "Cookies deleted" });
}
