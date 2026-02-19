-- CreateEnum
CREATE TYPE "public"."NfeStatus" AS ENUM ('PROCESSING', 'AUTHORIZED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "ie" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "price" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Nfe" (
    "id" TEXT NOT NULL,
    "status" "public"."NfeStatus" NOT NULL DEFAULT 'PROCESSING',
    "customerId" TEXT NOT NULL,
    "cfop" TEXT NOT NULL,
    "cst" TEXT NOT NULL,
    "totalValue" DECIMAL(12,2) NOT NULL,
    "xml" TEXT,
    "protocol" TEXT,
    "rejectionMsg" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nfe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NfeItem" (
    "id" TEXT NOT NULL,
    "nfeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "NfeItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_cnpj_key" ON "public"."Customer"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "public"."Product"("sku");

-- AddForeignKey
ALTER TABLE "public"."Nfe" ADD CONSTRAINT "Nfe_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NfeItem" ADD CONSTRAINT "NfeItem_nfeId_fkey" FOREIGN KEY ("nfeId") REFERENCES "public"."Nfe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NfeItem" ADD CONSTRAINT "NfeItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
