-- DropForeignKey
ALTER TABLE `Commission` DROP FOREIGN KEY `Commission_investmentId_fkey`;

-- DropForeignKey
ALTER TABLE `Document` DROP FOREIGN KEY `Document_investmentId_fkey`;

-- DropForeignKey
ALTER TABLE `News` DROP FOREIGN KEY `News_investmentId_fkey`;

-- DropForeignKey
ALTER TABLE `Reservation` DROP FOREIGN KEY `Reservation_investorId_fkey`;

-- DropForeignKey
ALTER TABLE `Reservation` DROP FOREIGN KEY `Reservation_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Schedule` DROP FOREIGN KEY `Schedule_investmentId_fkey`;

-- DropForeignKey
ALTER TABLE `YieldAdjustment` DROP FOREIGN KEY `YieldAdjustment_investmentId_fkey`;

-- DropIndex
DROP INDEX `Document_investmentId_fkey` ON `Document`;

-- DropIndex
DROP INDEX `News_investmentId_fkey` ON `News`;

-- DropIndex
DROP INDEX `Reservation_investorId_fkey` ON `Reservation`;

-- DropIndex
DROP INDEX `Reservation_userId_fkey` ON `Reservation`;

-- DropIndex
DROP INDEX `Schedule_investmentId_fkey` ON `Schedule`;

-- AddForeignKey
ALTER TABLE `YieldAdjustment` ADD CONSTRAINT `YieldAdjustment_investmentId_fkey` FOREIGN KEY (`investmentId`) REFERENCES `Investment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Commission` ADD CONSTRAINT `Commission_investmentId_fkey` FOREIGN KEY (`investmentId`) REFERENCES `Investment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `News` ADD CONSTRAINT `News_investmentId_fkey` FOREIGN KEY (`investmentId`) REFERENCES `Investment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_investmentId_fkey` FOREIGN KEY (`investmentId`) REFERENCES `Investment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_investmentId_fkey` FOREIGN KEY (`investmentId`) REFERENCES `Investment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_investorId_fkey` FOREIGN KEY (`investorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
