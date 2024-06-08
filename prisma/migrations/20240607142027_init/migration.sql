-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(7) NOT NULL,
    `name` VARCHAR(191) NULL,
    `username` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` BIGINT NULL,
    `emailVerified` DATETIME(3) NULL,
    `password` VARCHAR(72) NULL,
    `image` VARCHAR(191) NULL,
    `designation` VARCHAR(100) NULL,
    `departmentCode` VARCHAR(20) NULL,
    `role` ENUM('admin', 'staff', 'invigilator') NULL DEFAULT 'invigilator',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_departmentCode_idx`(`departmentCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,
    `refresh_token_expires_in` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Account_userId_key`(`userId`),
    INDEX `Account_userId_idx`(`userId`),
    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    INDEX `Session_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Authenticator` (
    `credentialID` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `credentialPublicKey` VARCHAR(191) NOT NULL,
    `counter` INTEGER NOT NULL,
    `credentialDeviceType` VARCHAR(191) NOT NULL,
    `credentialBackedUp` BOOLEAN NOT NULL,
    `transports` VARCHAR(191) NULL,

    UNIQUE INDEX `Authenticator_credentialID_key`(`credentialID`),
    PRIMARY KEY (`userId`, `credentialID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BannedStudent` (
    `studentId` BIGINT UNSIGNED NOT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    PRIMARY KEY (`studentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Block` (
    `id` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `type` ENUM('core', 'common', 'complementary', 'optional', 'elective', 'open', 'skill', 'general', 'project', 'vocational', 'choice', 'language', 'common2') NULL,
    `semester` TINYINT UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExamDateTime` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATE NULL,
    `timeCode` ENUM('AN', 'FN') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Department` (
    `id` TINYINT UNSIGNED NULL,
    `code` VARCHAR(20) NOT NULL,
    `name` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `Department_id_key`(`id`),
    UNIQUE INDEX `Department_name_key`(`name`),
    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Exam` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `dateTimeId` INTEGER NULL,
    `courseId` VARCHAR(100) NULL,

    INDEX `Exam_courseId_idx`(`courseId`),
    UNIQUE INDEX `Exam_dateTimeId_courseId_key`(`dateTimeId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Program` (
    `id` TINYINT UNSIGNED NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `duration` TINYINT UNSIGNED NOT NULL,
    `level` ENUM('UG', 'PG') NOT NULL,
    `isAided` BOOLEAN NULL DEFAULT true,
    `hasOpenCourse` BOOLEAN NULL DEFAULT false,
    `abbreviation` VARCHAR(50) NOT NULL,
    `departmentCode` VARCHAR(20) NULL,

    INDEX `Program_departmentCode_idx`(`departmentCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Room` (
    `id` INTEGER UNSIGNED NOT NULL,
    `internalRows` TINYINT UNSIGNED NOT NULL,
    `internalCols` TINYINT UNSIGNED NOT NULL,
    `finalRows` TINYINT UNSIGNED NOT NULL,
    `finalCols` TINYINT UNSIGNED NOT NULL,
    `isAvailable` BOOLEAN NOT NULL DEFAULT false,
    `floor` TINYINT UNSIGNED NULL,
    `description` VARCHAR(255) NULL,
    `priority` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `blockId` VARCHAR(100) NULL,

    INDEX `Room_blockId_idx`(`blockId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SeatingTimeConfig` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `day` VARCHAR(255) NOT NULL,
    `startTime` TIME(0) NOT NULL,
    `endTime` TIME(0) NOT NULL,
    `timeCode` ENUM('AN', 'FN') NULL DEFAULT 'AN',

    UNIQUE INDEX `SeatingTimeConfig_day_timeCode_key`(`day`, `timeCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentSeat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `seatNumber` INTEGER UNSIGNED NULL,
    `studentId` BIGINT UNSIGNED NOT NULL,
    `examId` INTEGER UNSIGNED NOT NULL,
    `isPresent` BOOLEAN NOT NULL DEFAULT true,
    `roomId` INTEGER UNSIGNED NULL,

    INDEX `StudentSeat_examId_idx`(`examId`),
    INDEX `StudentSeat_roomId_idx`(`roomId`),
    UNIQUE INDEX `StudentSeat_studentId_examId_key`(`studentId`, `examId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `id` BIGINT UNSIGNED NOT NULL,
    `rollNumber` INTEGER UNSIGNED NOT NULL,
    `programId` TINYINT UNSIGNED NOT NULL,
    `semester` TINYINT UNSIGNED NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(320) NULL,
    `phone` BIGINT UNSIGNED NULL,
    `openCourseId` VARCHAR(100) NULL,
    `secondLang1Id` VARCHAR(100) NULL,
    `secondLang2Id` VARCHAR(100) NULL,

    UNIQUE INDEX `Student_rollNumber_key`(`rollNumber`),
    INDEX `Student_openCourseId_idx`(`openCourseId`),
    INDEX `Student_programId_idx`(`programId`),
    INDEX `Student_secondLang1Id_idx`(`secondLang1Id`),
    INDEX `Student_secondLang2Id_idx`(`secondLang2Id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplementary` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `examId` INTEGER UNSIGNED NULL,
    `studentId` BIGINT UNSIGNED NULL,

    INDEX `Supplementary_studentId_idx`(`studentId`),
    UNIQUE INDEX `Supplementary_examId_studentId_key`(`examId`, `studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeacherSeat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` INTEGER UNSIGNED NULL,
    `dateTimeId` INTEGER NULL,
    `attendanceSubmitted` BOOLEAN NOT NULL DEFAULT false,
    `userId` VARCHAR(7) NULL,

    INDEX `TeacherSeat_userId_idx`(`userId`),
    INDEX `TeacherSeat_dateTimeId_idx`(`dateTimeId`),
    UNIQUE INDEX `TeacherSeat_roomId_dateTimeId_key`(`roomId`, `dateTimeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProgramCourses` (
    `A` VARCHAR(100) NOT NULL,
    `B` TINYINT UNSIGNED NOT NULL,

    UNIQUE INDEX `_ProgramCourses_AB_unique`(`A`, `B`),
    INDEX `_ProgramCourses_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_departmentCode_fkey` FOREIGN KEY (`departmentCode`) REFERENCES `Department`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Authenticator` ADD CONSTRAINT `Authenticator_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BannedStudent` ADD CONSTRAINT `BannedStudent_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exam` ADD CONSTRAINT `Exam_dateTimeId_fkey` FOREIGN KEY (`dateTimeId`) REFERENCES `ExamDateTime`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exam` ADD CONSTRAINT `Exam_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Program` ADD CONSTRAINT `Program_departmentCode_fkey` FOREIGN KEY (`departmentCode`) REFERENCES `Department`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_blockId_fkey` FOREIGN KEY (`blockId`) REFERENCES `Block`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentSeat` ADD CONSTRAINT `StudentSeat_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentSeat` ADD CONSTRAINT `StudentSeat_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `Exam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentSeat` ADD CONSTRAINT `StudentSeat_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_programId_fkey` FOREIGN KEY (`programId`) REFERENCES `Program`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_openCourseId_fkey` FOREIGN KEY (`openCourseId`) REFERENCES `Course`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_secondLang1Id_fkey` FOREIGN KEY (`secondLang1Id`) REFERENCES `Course`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_secondLang2Id_fkey` FOREIGN KEY (`secondLang2Id`) REFERENCES `Course`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supplementary` ADD CONSTRAINT `Supplementary_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `Exam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supplementary` ADD CONSTRAINT `Supplementary_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherSeat` ADD CONSTRAINT `TeacherSeat_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherSeat` ADD CONSTRAINT `TeacherSeat_dateTimeId_fkey` FOREIGN KEY (`dateTimeId`) REFERENCES `ExamDateTime`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherSeat` ADD CONSTRAINT `TeacherSeat_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProgramCourses` ADD CONSTRAINT `_ProgramCourses_A_fkey` FOREIGN KEY (`A`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProgramCourses` ADD CONSTRAINT `_ProgramCourses_B_fkey` FOREIGN KEY (`B`) REFERENCES `Program`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
