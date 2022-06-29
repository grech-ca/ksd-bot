/*
  Warnings:

  - A unique constraint covering the columns `[userId,type]` on the table `Achievement` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Achievement_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_userId_type_key" ON "Achievement"("userId", "type");
