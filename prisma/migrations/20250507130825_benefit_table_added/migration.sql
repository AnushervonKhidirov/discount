/*
  Warnings:

  - You are about to drop the `cashbacks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `discounts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `cashbacks` DROP FOREIGN KEY `cashbacks_bank_id_fkey`;

-- DropForeignKey
ALTER TABLE `cashbacks` DROP FOREIGN KEY `cashbacks_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `discounts` DROP FOREIGN KEY `discounts_company_id_fkey`;

-- DropTable
DROP TABLE `cashbacks`;

-- DropTable
DROP TABLE `discounts`;

-- CreateTable
CREATE TABLE `benefits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('DISCOUNT', 'CASHBACK') NOT NULL,
    `size` TINYINT NOT NULL,
    `about` MEDIUMTEXT NULL,
    `start_at` DATETIME NOT NULL,
    `end_at` DATETIME NOT NULL,
    `archived` BOOLEAN NOT NULL DEFAULT false,
    `company_id` INTEGER NOT NULL,
    `bank_id` INTEGER NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `benefits` ADD CONSTRAINT `benefits_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `benefits` ADD CONSTRAINT `benefits_bank_id_fkey` FOREIGN KEY (`bank_id`) REFERENCES `banks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
