import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();  
    const {  qty,sname } = body;

     if (!sname) {
      return NextResponse.json({ error: "Short name is required" }, { status: 400 });
    }
    
    const updateMt = await db.raw_material.update({
        where:{
            short_name: sname
        },
        data:{
            Quantity:{
              increment: qty
            }
        }
    })

    console.log("Raw Material Quantity Updated");
    return NextResponse.json(updateMt, { status: 200 });
  } catch (err) {
    console.error("Error in POST:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
