import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();  
    const { name, qty,sname } = body;

    
    const rawmat  = await db.raw_material.create({
      data:{
        name: name,
        Quantity: qty,
        short_name:sname
      }
    }) 

    console.log("Raw Material Created created");
    return NextResponse.json(rawmat, { status: 200 });
  } catch (err) {
    console.error("Error in POST /dpr:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
