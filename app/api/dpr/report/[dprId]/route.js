import { PrismaClient } from "@prisma/client";
import PDFDocument from "pdfkit";
import { NextResponse } from "next/server";
import path from "path";

const db = new PrismaClient();

function generatePdf(dpr, pipes) {
  return new Promise((resolve, reject) => {
    // ✅ Disable default font loading to avoid Helvetica.afm error
    const doc = new PDFDocument({ margin: 40, font: null });

    // ✅ YOUR EXACT FONT SETUP
    const fontPath = path.join(process.cwd(), "app", "api", "fonts", "OpenSans_Condensed-Bold.ttf");
    doc.registerFont("CustomFont", fontPath);
    doc.font("CustomFont");

    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Header
    doc.font("CustomFont").fontSize(20).text("ISCON PIPES DPR REPORT", { align: "center" });
    doc.moveDown();

    // DPR Date
    const formattedDate = new Date(dpr.date).toLocaleString("en-IN");
    doc.font("CustomFont").fontSize(14).text(`DPR Date: ${formattedDate}`);
    doc.moveDown();

    // Table — Raw Materials Used
    doc.font("CustomFont").fontSize(16).text("Raw Materials Used:", { underline: true });
    doc.moveDown(0.5);

    let y = doc.y;
    const startX = 40;
    const colWidths = [200, 100, 100];

    // Table Headers
    doc.rect(startX, y, colWidths[0], 20).stroke();
    doc.rect(startX + colWidths[0], y, colWidths[1], 20).stroke();
    doc.rect(startX + colWidths[0] + colWidths[1], y, colWidths[2], 20).stroke();

    doc.font("CustomFont").fontSize(12)
      .text("Raw Material", startX + 5, y + 5)
      .text("Qty Used", startX + colWidths[0] + 5, y + 5)
      .text("Remaining", startX + colWidths[0] + colWidths[1] + 5, y + 5);

    y += 20;

    // Table Rows
    dpr.rawMaterials.forEach((item) => {
      doc.rect(startX, y, colWidths[0], 20).stroke();
      doc.rect(startX + colWidths[0], y, colWidths[1], 20).stroke();
      doc.rect(startX + colWidths[0] + colWidths[1], y, colWidths[2], 20).stroke();

      doc.font("CustomFont").text(item.rawMaterial.name, startX + 5, y + 5);
      doc.font("CustomFont").text(item.quantity_used.toString(), startX + colWidths[0] + 5, y + 5);
      doc.font("CustomFont").text(item.rawMaterial.Quantity.toString(), startX + colWidths[0] + colWidths[1] + 5, y + 5);

      y += 20;
    });

    doc.moveDown(1.5);

    const totalQtyUsed = dpr.Total;
    doc.font("CustomFont").fontSize(14).text(`Total Raw Materials Used: ${totalQtyUsed} units`);
    doc.moveDown();

    // Table — Pipes Produced
    doc.font("CustomFont").fontSize(16).text("Pipes Produced:", { underline: true });
    doc.moveDown(0.5);

    y = doc.y;

    // Table Headers
    doc.rect(startX, y, colWidths[0], 20).stroke();
    doc.rect(startX + colWidths[0], y, colWidths[1], 20).stroke();
    doc.rect(startX + colWidths[0] + colWidths[1], y, colWidths[2], 20).stroke();

    doc.font("CustomFont").fontSize(12)
      .text("Pipe", startX + 5, y + 5)
      .text("Qty Produced", startX + colWidths[0] + 5, y + 5)
      .text("Weight (kg)", startX + colWidths[0] + colWidths[1] + 5, y + 5);

    y += 20;

    // Table Rows
    pipes.pipes.forEach((item) => {
      doc.rect(startX, y, colWidths[0], 20).stroke();
      doc.rect(startX + colWidths[0], y, colWidths[1], 20).stroke();
      doc.rect(startX + colWidths[0] + colWidths[1], y, colWidths[2], 20).stroke();

      doc.font("CustomFont").text(item.pipe.name, startX + 5, y + 5);
      doc.font("CustomFont").text(item.quantity_used.toString(), startX + colWidths[0] + 5, y + 5);
      doc.font("CustomFont").text(item.pipe.weight.toString(), startX + colWidths[0] + colWidths[1] + 5, y + 5);

      y += 20;
    });

    doc.moveDown(1.5);

    const totalPipesProduced = pipes.pipes.reduce(
      (total, item) => total + Number(item.quantity_used) * Number(item.pipe.weight || 0),
      0
    );

    doc.font("CustomFont").fontSize(14).text(`Total Pipes Produced: ${totalPipesProduced} KG`);
    doc.moveDown();

    const balance = totalQtyUsed - totalPipesProduced;
    doc.font("CustomFont").fontSize(14).text(`Balance: ${balance} KG`);
    doc.moveDown(2);

    // Footer
    const generatedAt = new Date().toLocaleString("en-IN");
    doc.font("CustomFont").fontSize(10).text(`Generated On: ${generatedAt}`, { align: "right" });

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
