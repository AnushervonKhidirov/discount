/*
  Warnings:

  - You are about to alter the column `start_at` on the `benefits` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `end_at` on the `benefits` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `benefits` MODIFY `start_at` DATETIME NOT NULL,
    MODIFY `end_at` DATETIME NOT NULL;

-- CreateTable
CREATE TABLE `_CompanyToCountry` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CompanyToCountry_AB_unique`(`A`, `B`),
    INDEX `_CompanyToCountry_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CompanyToCountry` ADD CONSTRAINT `_CompanyToCountry_A_fkey` FOREIGN KEY (`A`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CompanyToCountry` ADD CONSTRAINT `_CompanyToCountry_B_fkey` FOREIGN KEY (`B`) REFERENCES `countries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
