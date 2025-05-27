/*
  Warnings:

  - You are about to alter the column `start_at` on the `promotions` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `end_at` on the `promotions` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Made the column `category_id` on table `companies` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `companies` DROP FOREIGN KEY `companies_category_id_fkey`;

-- DropIndex
DROP INDEX `companies_category_id_fkey` ON `companies`;

-- AlterTable
ALTER TABLE `companies` ADD COLUMN `rating` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `review` INTEGER NOT NULL DEFAULT 0,
    MODIFY `category_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `promotions` MODIFY `start_at` DATETIME NOT NULL,
    MODIFY `end_at` DATETIME NOT NULL;

-- AddForeignKey
ALTER TABLE `companies` ADD CONSTRAINT `companies_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
