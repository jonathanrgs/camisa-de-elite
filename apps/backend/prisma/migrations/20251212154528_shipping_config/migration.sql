-- AlterTable
ALTER TABLE "Order" ADD COLUMN "complement" TEXT;
ALTER TABLE "Order" ADD COLUMN "neighborhood" TEXT;
ALTER TABLE "Order" ADD COLUMN "number" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "address" TEXT;
ALTER TABLE "User" ADD COLUMN "city" TEXT;
ALTER TABLE "User" ADD COLUMN "complement" TEXT;
ALTER TABLE "User" ADD COLUMN "favoriteTeam" TEXT;
ALTER TABLE "User" ADD COLUMN "neighborhood" TEXT;
ALTER TABLE "User" ADD COLUMN "number" TEXT;
ALTER TABLE "User" ADD COLUMN "state" TEXT;
ALTER TABLE "User" ADD COLUMN "zipCode" TEXT;

-- CreateTable
CREATE TABLE "ShippingConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "freeShippingMin" REAL NOT NULL,
    "fixedShipping" REAL NOT NULL,
    "cityRules" TEXT NOT NULL,
    "originCep" TEXT,
    "originNumber" TEXT,
    "radiusKm" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CartReservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "CartReservation_expiresAt_idx" ON "CartReservation"("expiresAt");

-- CreateIndex
CREATE INDEX "CartReservation_sessionId_idx" ON "CartReservation"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "CartReservation_sessionId_productId_size_key" ON "CartReservation"("sessionId", "productId", "size");
