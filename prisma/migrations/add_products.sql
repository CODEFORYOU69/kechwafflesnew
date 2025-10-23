-- CreateTable
CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "price" DOUBLE PRECISION,
    "isModifier" BOOLEAN NOT NULL DEFAULT false,
    "hasTax" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "loyverseItemId" TEXT,
    "lastSyncAt" TIMESTAMP(3),
    "syncSource" TEXT NOT NULL DEFAULT 'MANUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "option1Name" TEXT,
    "option1Value" TEXT,
    "option2Name" TEXT,
    "option2Value" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "variantSku" TEXT,
    "loyverseVariantId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Product_handle_key" ON "Product"("handle");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Product_loyverseItemId_key" ON "Product"("loyverseItemId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Product_isActive_idx" ON "Product"("isActive");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Product_displayOrder_idx" ON "Product"("displayOrder");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Product_loyverseItemId_idx" ON "Product"("loyverseItemId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ProductVariant_variantSku_key" ON "ProductVariant"("variantSku");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ProductVariant_loyverseVariantId_key" ON "ProductVariant"("loyverseVariantId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ProductVariant_loyverseVariantId_idx" ON "ProductVariant"("loyverseVariantId");

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
