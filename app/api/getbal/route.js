import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function GET(request) {
    try {
        const existingBalance = await db.balance.findFirst();
        
        
        return NextResponse.json(existingBalance, { status: 200 });

    } catch (error) {
        console.error("❌ Error in balance route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}