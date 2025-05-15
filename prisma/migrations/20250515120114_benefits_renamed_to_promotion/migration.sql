/*
  Warnings:

  - You are about to drop the `_BenefitToStore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `benefits` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_BenefitToStore` DROP FOREIGN KEY `_BenefitToStore_A_fkey`;

-- DropForeignKey
ALTER TABLE `_BenefitToStore` DROP FOREIGN KEY `_BenefitToStore_B_fkey`;

-- DropForeignKey
ALTER TABLE `benefits` DROP FOREIGN KEY `benefits_bank_id_fkey`;

-- DropForeignKey
ALTER TABLE `benefits` DROP FOREIGN KEY `benefits_company_id_fkey`;

-- DropTable
DROP TABLE `_BenefitToStore`;

-- DropTable
DROP TABLE `benefits`;

-- CreateTable
CREATE TABLE `promotions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('DISCOUNT', 'CASHBACK', 'PROMO_CODE') NOT NULL,
    `size` TINYINT NOT NULL,
    `message` TEXT NULL,
    `start_at` DATETIME NOT NULL,
    `end_at` DATETIME NOT NULL,
    `archived` BOOLEAN NOT NULL DEFAULT false,
    `company_id` INTEGER NOT NULL,
    `bank_id` INTEGER NULL,
    `promo_code` VARCHAR(20) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PromotionToStore` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PromotionToStore_AB_unique`(`A`, `B`),
    INDEX `_PromotionToStore_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `promotions` ADD CONSTRAINT `promotions_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promotions` ADD CONSTRAINT `promotions_bank_id_fkey` FOREIGN KEY (`bank_id`) REFERENCES `banks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PromotionToStore` ADD CONSTRAINT `_PromotionToStore_A_fkey` FOREIGN KEY (`A`) REFERENCES `promotions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PromotionToStore` ADD CONSTRAINT `_PromotionToStore_B_fkey` FOREIGN KEY (`B`) REFERENCES `stores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
