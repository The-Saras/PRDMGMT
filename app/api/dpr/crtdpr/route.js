import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function POST(request) {
  try {
    
    const dpr = await db.dpr.create({
      data:{}
    });

    console.log("dpr created");
    return NextResponse.json(dpr, { status: 200 });
  } catch (err) {
    console.error("Error in POST /dpr:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
