/*
  Warnings:

  - You are about to alter the column `start_at` on the `benefits` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `end_at` on the `benefits` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `address` to the `stores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city_id` to the `stores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country_id` to the `stores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `benefits` MODIFY `start_at` DATETIME NOT NULL,
    MODIFY `end_at` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `stores` ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `city_id` INTEGER NOT NULL,
    ADD COLUMN `country_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `stores` ADD CONSTRAINT `stores_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stores` ADD CONSTRAINT `stores_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
