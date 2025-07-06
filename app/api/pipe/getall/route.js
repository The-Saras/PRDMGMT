import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function GET(request) {
  try {
    const res = await db.pipe.findMany({
      select:{
        id: true,
        name: true,
        weight: true,
        Quantity: true,
        sname: true,
        type: true,
      }
    });
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
