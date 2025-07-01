import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const db = new PrismaClient();

export async function GET(request) {
  try {
    const rawMaterials = await db.raw_material.findMany({
      select: {
        id: true,
        name: true,
        short_name: true,
        Quantity: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    if (!rawMaterials || rawMaterials.length === 0) {
      return NextResponse.json({ message: "No raw materials found" }, { status: 404 });
    }

    return NextResponse.json(rawMaterials, { status: 200 });

  } catch (err) {
    console.error("Error in GET:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
