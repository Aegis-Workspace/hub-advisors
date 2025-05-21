-- AlterTable
ALTER TABLE `Investment` MODIFY `status` ENUM('PAUSED', 'OPEN', 'CLOSED', 'RESERVED', 'DRAFT') NOT NULL;
