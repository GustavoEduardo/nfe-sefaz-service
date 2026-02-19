/*
  Warnings:

  - You are about to drop the column `productId` on the `NfeItem` table. All the data in the column will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `NfeItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."NfeItem" DROP CONSTRAINT "NfeItem_productId_fkey";

-- AlterTable
ALTER TABLE "public"."NfeItem" DROP COLUMN "productId",
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Product";
