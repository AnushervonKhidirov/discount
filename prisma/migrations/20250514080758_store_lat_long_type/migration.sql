/*
  Warnings:

  - You are about to alter the column `start_at` on the `benefits` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `end_at` on the `benefits` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `latitude` on the `stores` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `longitude` on the `stores` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `benefits` MODIFY `start_at` DATETIME NOT NULL,
    MODIFY `end_at` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `stores` MODIFY `latitude` VARCHAR(191) NOT NULL,
    MODIFY `longitude` VARCHAR(191) NOT NULL;
