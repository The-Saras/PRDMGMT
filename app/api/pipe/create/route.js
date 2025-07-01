import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, sname, weight, size, type } = body;

    const Pipe = await db.pipe.create({
      data: {
        name: name,
        sname: sname,
        weight: weight,
        size: size,
        type: type,
      }
    });



    console.log("Pipe created");
    return NextResponse.json(Pipe, { status: 200 });
  } catch (err) {
    console.error("Error in POST /dpr:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
