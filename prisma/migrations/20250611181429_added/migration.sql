-- CreateTable
CREATE TABLE "Raw_material" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "short_name" TEXT,

    CONSTRAINT "Raw_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pipe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "Quantity" INTEGER NOT NULL,

    CONSTRAINT "Pipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dpr" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dpr_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Raw_materialdpr" (
    "id" TEXT NOT NULL,
    "dprId" TEXT NOT NULL,
    "rawMaterialId" TEXT NOT NULL,
    "quantity_used" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Raw_materialdpr_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Raw_materialdpr" ADD CONSTRAINT "Raw_materialdpr_dprId_fkey" FOREIGN KEY ("dprId") REFERENCES "Dpr"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Raw_materialdpr" ADD CONSTRAINT "Raw_materialdpr_rawMaterialId_fkey" FOREIGN KEY ("rawMaterialId") REFERENCES "Raw_material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
