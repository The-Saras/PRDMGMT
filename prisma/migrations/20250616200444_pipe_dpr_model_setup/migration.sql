-- CreateTable
CREATE TABLE "PipeDpr" (
    "id" TEXT NOT NULL,
    "dprId" TEXT NOT NULL,
    "pipeId" TEXT NOT NULL,
    "quantity_used" INTEGER NOT NULL,

    CONSTRAINT "PipeDpr_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PipeDpr" ADD CONSTRAINT "PipeDpr_dprId_fkey" FOREIGN KEY ("dprId") REFERENCES "Dpr"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipeDpr" ADD CONSTRAINT "PipeDpr_pipeId_fkey" FOREIGN KEY ("pipeId") REFERENCES "Pipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
