/*
  Warnings:

  - A unique constraint covering the columns `[numero,serie]` on the table `Nfe` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dataEmissao` to the `Nfe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `naturezaOperacao` to the `Nfe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `Nfe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serie` to the `Nfe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigo` to the `NfeItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ncm` to the `NfeItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unidade` to the `NfeItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Nfe" ADD COLUMN     "dataEmissao" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "naturezaOperacao" TEXT NOT NULL,
ADD COLUMN     "numero" INTEGER NOT NULL,
ADD COLUMN     "serie" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."NfeItem" ADD COLUMN     "codigo" TEXT NOT NULL,
ADD COLUMN     "ncm" TEXT NOT NULL,
ADD COLUMN     "unidade" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Nfe_numero_serie_key" ON "public"."Nfe"("numero", "serie");
