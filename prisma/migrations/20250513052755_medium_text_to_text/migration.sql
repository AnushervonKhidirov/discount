/*
  Warnings:

  - You are about to alter the column `start_at` on the `benefits` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `end_at` on the `benefits` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `benefits` MODIFY `start_at` DATETIME NOT NULL,
    MODIFY `end_at` DATETIME NOT NULL,
    MODIFY `message` TEXT NULL;

-- AlterTable
ALTER TABLE `companies` MODIFY `about` TEXT NULL;
