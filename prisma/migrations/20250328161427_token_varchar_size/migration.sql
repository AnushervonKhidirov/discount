/*
  Warnings:

  - The primary key for the `tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `tokens` DROP PRIMARY KEY,
    MODIFY `refresh_token` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`refresh_token`);
