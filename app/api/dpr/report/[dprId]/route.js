import { PrismaClient } from "@prisma/client";
import PDFDocument from "pdfkit";
import { NextResponse } from "next/server";
import path from "path";

const db = new PrismaClient();

function generatePdf(dpr, pipes) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ font: null });
    const fontPath = path.join(process.cwd(), "app", "api", "fonts", "OpenSans_Condensed-Bold.ttf");
    doc.registerFont("CustomFont", fontPath);
    doc.font("CustomFont");

    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Set built-in font here — this works


    // Header
    doc.fontSize(20).text("ISCON PIPES DPR REPORT", { align: "center" });
    doc.moveDown();

    // DPR Date
    const formattedDate = new Date(dpr.date).toLocaleString("en-IN");
    doc.fontSize(14).text(`DPR Date: ${formattedDate}`);
    doc.moveDown();

    // Raw Materials Used
    doc.fontSize(16).text("Raw Materials Used:");
    doc.moveDown(0.5);
    dpr.rawMaterials.forEach((item) => {
      doc
        .fontSize(12)
        .text(
          `• ${item.rawMaterial.name} — ${item.quantity_used} units (Remaining: ${item.rawMaterial.Quantity})`
        );
    });
    doc.moveDown();

    const totalQtyUsed = dpr.Total


    doc.fontSize(14).text(`Total Raw Materials Used: ${totalQtyUsed} units`);
    doc.moveDown();

    // Pipes Produced
    doc.fontSize(16).text("Pipes Produced:");
    doc.moveDown(0.5);
    pipes.pipes.forEach((item) => {
      doc
        .fontSize(12)
        .text(
          `• ${item.pipe.name} — ${item.quantity_used} units (Stock Left: ${item.pipe.Quantity}) | ${item.pipe.weight} kg`
        );
    });
    doc.moveDown();

    const totalPipesProduced = pipes.pipes
      .reduce(
        (total, item) =>
          total +
          Number(item.quantity_used) *
          Number(item.pipe.weight || 0),
        0
      )

    doc.fontSize(14).text(`Total Pipes Produced: ${totalPipesProduced} KG`);
    doc.moveDown();
    
    const balance = totalQtyUsed - totalPipesProduced;
    doc.fontSize(14).text(`Balance: ${balance} KG`);
    doc.moveDown();
    // Footer
    const generatedAt = new Date().toLocaleString("en-IN");
    doc.fontSize(10).text(`Generated On: ${generatedAt}`, { align: "right" });

    doc.end();
  });
}



export async function GET(request, context) {
  const { dprId } = await context.params;

  try {
    const dpr = await db.dpr.findUnique({
      where: { id: dprId },
      include: {
        rawMaterials: {
          include: {
            rawMaterial: true,
          },
        },
      },
    });

    const pipes = await db.dpr.findUnique({
      where: { id: dprId },
      include: {
        pipes: {
          include: {
            pipe: true,
          },
        },
      },
    });

    if (!dpr || !pipes) {
      return NextResponse.json({ error: "DPR not found" }, { status: 404 });
    }

    const pdfBuffer = await generatePdf(dpr, pipes);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="DPR-${dprId}.pdf"`,
      },
    });
  } catch (err) {
    console.error("Error generating DPR PDF:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
