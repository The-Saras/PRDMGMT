/*
  Warnings:

  - A unique constraint covering the columns `[sname]` on the table `Pipe` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Pipe" ADD COLUMN     "sname" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION,
ALTER COLUMN "Quantity" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pipe_sname_key" ON "Pipe"("sname");
