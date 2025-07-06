import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// You can use GET for query params, not POST
export async function GET(request) {
  try {
    // Get query params from URL
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const weight = searchParams.get("weight");

    const filter = {};
    if (type) filter.type = type;
     if (weight) filter.weight = parseFloat(weight);

    const filteredPipes = await prisma.pipe.findMany({
      where: filter,
    });

    return NextResponse.json( filteredPipes );
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
