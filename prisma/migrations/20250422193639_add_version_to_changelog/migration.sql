/*
  Warnings:

  - Added the required column `version` to the `Changelog` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Changelog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "fromDate" DATETIME NOT NULL,
    "toDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Changelog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Changelog" ("content", "createdAt", "fromDate", "id", "projectId", "title", "toDate") SELECT "content", "createdAt", "fromDate", "id", "projectId", "title", "toDate" FROM "Changelog";
DROP TABLE "Changelog";
ALTER TABLE "new_Changelog" RENAME TO "Changelog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
