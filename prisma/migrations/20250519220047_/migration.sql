-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'advisor', 'cliente') NOT NULL,
    `status` ENUM('ATIVO', 'INATIVO') NOT NULL DEFAULT 'ATIVO',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cpf` VARCHAR(191) NULL,
    `rg` VARCHAR(191) NULL,
    `address` JSON NULL,
    `bankAccount` JSON NULL,
    `parentId` INTEGER NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Investment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NULL,
    `type` ENUM('CDB', 'LCI', 'LCA', 'DEBENTURE') NOT NULL,
    `yieldRate` DOUBLE NULL,
    `yieldIndex` ENUM('CDI', 'IPCA') NULL,
    `minAmount` DOUBLE NOT NULL,
    `totalAmount` DOUBLE NULL,
    `availableAmount` DOUBLE NULL,
    `reservedAmount` DOUBLE NULL,
    `term` INTEGER NULL,
    `guarantee` JSON NOT NULL,
    `paymentFrequency` ENUM('MONTHLY', 'QUARTERLY', 'SEMIANNUAL') NULL,
    `registeredWith` JSON NOT NULL,
    `riskLevel` ENUM('LOW', 'MODERATE', 'HIGH') NULL,
    `logo` VARCHAR(191) NULL,
    `status` ENUM('OPEN', 'CLOSED', 'RESERVED', 'DRAFT') NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `autoCloseDate` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `YieldAdjustment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enabled` BOOLEAN NOT NULL,
    `minRate` DOUBLE NOT NULL,
    `maxRate` DOUBLE NOT NULL,
    `investmentId` INTEGER NOT NULL,

    UNIQUE INDEX `YieldAdjustment_investmentId_key`(`investmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Commission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `investmentId` INTEGER NOT NULL,
    `upfrontRate` DOUBLE NOT NULL,
    `upfrontPayment` ENUM('ON_CONFIRMATION', 'ON_INVESTMENT', 'MONTHLY') NOT NULL,
    `recurringRate` DOUBLE NOT NULL,
    `recurringFrequency` ENUM('MONTHLY', 'QUARTERLY', 'SEMIANNUAL') NOT NULL,
    `yieldAdjustment` JSON NULL,
    `amount` INTEGER NULL,
    `status` ENUM('PENDING', 'PAID') NULL,
    `dueDate` DATETIME(3) NULL,
    `paidDate` DATETIME(3) NULL,

    UNIQUE INDEX `Commission_investmentId_key`(`investmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `News` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `investmentId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Schedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `investmentId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `principal` DOUBLE NOT NULL,
    `interest` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Document` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `investmentId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reservation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `investorId` INTEGER NOT NULL,
    `investmentId` INTEGER NULL,
    `investorName` VARCHAR(191) NULL,
    `amount` DOUBLE NOT NULL,
    `status` ENUM('PENDING_SIGNATURE', 'SIGNED', 'CONFIRMED') NOT NULL,
    `commissionUpfrontRate` DOUBLE NULL,
    `commissionRecurringRate` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YieldAdjustment` ADD CONSTRAINT `YieldAdjustment_investmentId_fkey` FOREIGN KEY (`investmentId`) REFERENCES `Investment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Commission` ADD CONSTRAINT `Commission_investmentId_fkey` FOREIGN KEY (`investmentId`) REFERENCES `Investment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `News` ADD CONSTRAINT `News_investmentId_fkey` FOREIGN KEY (`investmentId`) REFERENCES `Investment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_investmentId_fkey` FOREIGN KEY (`investmentId`) REFERENCES `Investment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_investmentId_fkey` FOREIGN KEY (`investmentId`) REFERENCES `Investment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_investmentId_fkey` FOREIGN KEY (`investmentId`) REFERENCES `Investment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_investorId_fkey` FOREIGN KEY (`investorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
