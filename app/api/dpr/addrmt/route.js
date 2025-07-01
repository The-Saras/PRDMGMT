import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { dprId, sname, quantity_used } = body;

    if (!dprId || !sname || !quantity_used) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find the raw material
    const rawMaterial = await db.raw_material.findUnique({
      where: { short_name: sname },
    });

    if (!rawMaterial) {
      return NextResponse.json({ error: "Raw material not found" }, { status: 404 });
    }

    if (rawMaterial.Quantity < quantity_used) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }

    // Add to Raw_materialdpr table
    const newUsage = await db.raw_materialdpr.create({
      data: {
        dprId: dprId,
        rawMaterialId: rawMaterial.id,
        quantity_used: quantity_used,
      },
    });

    // Deduct from Raw_material quantity
    await db.raw_material.update({
      where: { id: rawMaterial.id },
      data: {
        Quantity: {
          decrement: quantity_used, 
        },
      },
    });

    console.log("Raw Material assigned to DPR and stock updated");
    return NextResponse.json(newUsage, { status: 200 });

  } catch (err) {
    console.error("Error in POST:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
