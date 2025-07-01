import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function POST(request) {
    try {
        const body = await request.json();
        const { diff } = body;
        console.log("Received diff:", diff);

        const existingBalance = await db.balance.findFirst()

        let result;

        if (existingBalance) {
            result = await db.balance.update({
                where: { id: existingBalance.id },
                data: { qutity: diff }
            })
        }
        else {
            // Create new balance record
            result = await db.balance.create({
                data: { qutity: diff },
            })
        }
        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error("❌ Error in balance route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}