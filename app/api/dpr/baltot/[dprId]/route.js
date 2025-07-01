import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const db = new PrismaClient();

export async function POST(request, { params }) {
    const body = await request.json();
    const { bal } = body;
    const {dprId} = params;
    try {
        const bringbaltototal = await db.dpr.update({
            where: { id: dprId },
            data: {
                Total: {
                    increment:bal
                }
            }
        })
        return NextResponse.json(bringbaltototal, { status: 200 });
        
    } catch (error) {
        console.error("❌ Error in route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}