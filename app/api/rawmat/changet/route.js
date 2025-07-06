import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { sname } = body;

    if (!sname) {
      return NextResponse.json({ error: "Short name is required" }, { status: 400 });
    }

    const changeT = await db.stockChange.findMany({
      where: { sname },
      
    });

    return NextResponse.json(changeT, { status: 200 });

  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
