/*
  Warnings:

  - Made the column `logo` on table `Investment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Investment` MODIFY `logo` TEXT NOT NULL;
