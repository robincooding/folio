-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "section" TEXT NOT NULL DEFAULT 'General';
