/*
  Warnings:

  - Added the required column `expired_at` to the `tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tokens` ADD COLUMN `expired_at` TIMESTAMP(0) NOT NULL;
