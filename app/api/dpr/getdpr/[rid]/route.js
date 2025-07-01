import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function GET(request, context) {
  const { rid } = await context.params;

  try {
    const dpr = await db.dpr.findUnique({
      where: {
        id: rid,
      },
      include: {
        rawMaterials: {
          include: {
            rawMaterial: {
              select: {
                name: true,
                Quantity: true
              }
            },

          },
        },


      }

    });

    const Pipes = await db.dpr.findUnique({
      where: {
        id: rid
      },
      include: {
        pipes: {
          include:{
            pipe:{
              select:{
                name:true,
                Quantity:true,
                weight:true
              }
            }
          }
        }
      }

    })

    if (!dpr) {
      return NextResponse.json({ error: "DPR not found" }, { status: 404 });
    }
    
    return NextResponse.json({dpr,Pipes}, { status: 200 });
  } catch (err) {
    console.error("Error in GET:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
