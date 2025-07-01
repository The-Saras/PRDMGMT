/*
  Warnings:

  - A unique constraint covering the columns `[short_name]` on the table `Raw_material` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Raw_material_short_name_key" ON "Raw_material"("short_name");
