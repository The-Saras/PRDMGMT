import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const db = new PrismaClient();

export async function POST(request, { params }) {
  const { dprId } = await params;
  
  

  try {
    const dprWithMaterials = await db.dpr.findUnique({
      where: { id: dprId },
      include: {
        rawMaterials: true
      }
    });

    if (!dprWithMaterials) {
      return NextResponse.json({ error: "DPR not found" }, { status: 404 });
    }

    const totalQtyUsed = dprWithMaterials.rawMaterials.reduce(
      (total, item) => total + Number(item.quantity_used || 0),
      0
    );

    console.log("Total Quantity Used:", totalQtyUsed);

    const updatedDpr = await db.dpr.update({
      where: {
        id: dprId
      },
      data: {
        Total: totalQtyUsed
      }
    });

    return NextResponse.json(updatedDpr, { status: 200 });

  } catch (error) {
    console.error("❌ Error in total route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
