import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { dprId, pipeId, quantity_produced } = body;

    // Input validation
    if (!dprId || !pipeId ||  quantity_produced <= 0) {
      return NextResponse.json({ error: "Invalid input values" }, { status: 400 });
    }

    // Check if DPR exists
    const dpr = await db.dpr.findUnique({ where: { id: dprId } });
    if (!dpr) {
      return NextResponse.json({ error: "DPR not found" }, { status: 404 });
    }

    // Check if Pipe exists
    const pipe = await db.pipe.findUnique({ where: { id: pipeId } });
    if (!pipe) {
      return NextResponse.json({ error: "Pipe not found" }, { status: 404 });
    }

    // Perform both actions in a transaction
    const result = await db.$transaction(async (tx) => {
      // 1️⃣ Increment pipe quantity
      const updatedPipe = await tx.pipe.update({
        where: { id: pipeId },
        data: {
          Quantity: { increment: quantity_produced }
        }
      });

      // 2️⃣ Log production into PipeDpr
      const pipeDprEntry = await tx.pipeDpr.create({
        data: {
          dprId,
          pipeId,
          quantity_used: quantity_produced
        }
      });

      return { updatedPipe, pipeDprEntry };
    });

    console.log("✅ Pipe production recorded in DPR and stock updated");

    return NextResponse.json(result, { status: 201 });

  } catch (err) {
    console.error("❌ Error recording pipe production:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
