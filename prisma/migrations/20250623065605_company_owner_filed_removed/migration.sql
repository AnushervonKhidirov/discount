/*
  Warnings:

  - You are about to alter the column `start_at` on the `promotions` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `end_at` on the `promotions` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `company_owner` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `promotions` MODIFY `start_at` DATETIME NOT NULL,
    MODIFY `end_at` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `company_owner`;
