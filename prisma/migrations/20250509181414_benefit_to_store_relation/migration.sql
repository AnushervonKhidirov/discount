/*
  Warnings:

  - You are about to drop the column `about` on the `benefits` table. All the data in the column will be lost.
  - You are about to alter the column `start_at` on the `benefits` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `end_at` on the `benefits` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `benefits` DROP COLUMN `about`,
    ADD COLUMN `message` MEDIUMTEXT NULL,
    ADD COLUMN `promo_code` VARCHAR(20) NULL,
    MODIFY `type` ENUM('DISCOUNT', 'CASHBACK', 'PROMO_CODE') NOT NULL,
    MODIFY `start_at` DATETIME NOT NULL,
    MODIFY `end_at` DATETIME NOT NULL;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(40) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BenefitToStore` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BenefitToStore_AB_unique`(`A`, `B`),
    INDEX `_BenefitToStore_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_BenefitToStore` ADD CONSTRAINT `_BenefitToStore_A_fkey` FOREIGN KEY (`A`) REFERENCES `benefits`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BenefitToStore` ADD CONSTRAINT `_BenefitToStore_B_fkey` FOREIGN KEY (`B`) REFERENCES `stores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
