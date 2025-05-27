/*
  Warnings:

  - You are about to alter the column `rating` on the `companies` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `start_at` on the `promotions` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `end_at` on the `promotions` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `companies` MODIFY `rating` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `promotions` MODIFY `start_at` DATETIME NOT NULL,
    MODIFY `end_at` DATETIME NOT NULL;
