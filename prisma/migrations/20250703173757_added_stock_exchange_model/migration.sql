-- CreateTable
CREATE TABLE "StockChange" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" INTEGER,
    "sname" TEXT,

    CONSTRAINT "StockChange_pkey" PRIMARY KEY ("id")
);
