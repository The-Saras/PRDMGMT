import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function GET(request) {
  try {
   const dprs = await db.dpr.findMany()
    return NextResponse.json(dprs, { status: 200 });
  } catch (err) {
    console.error("Error in POST:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
