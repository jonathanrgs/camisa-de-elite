/*
  Warnings:

  - You are about to drop the column `maxUses` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `maxUsesPerUser` on the `Coupon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "maxUses",
DROP COLUMN "maxUsesPerUser",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
