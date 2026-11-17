-- Settings of the public site, edited in /admin/site: additive, creates one empty table.
-- Run with: pnpm prisma db execute --file prisma/migrations/add_site_settings.sql --schema prisma/schema.prisma
CREATE TABLE IF NOT EXISTS "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'site',
    "sections" JSONB NOT NULL,
    "openingHours" JSONB NOT NULL,
    "isTemporarilyClosed" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
