-- Earlier settings work used both `global` and `singleton` for the one
-- platform-wide record. Preserve any existing configuration while adopting the
-- ID used by the application settings service.
UPDATE "PlatformSettings"
SET "id" = 'singleton'
WHERE "id" = 'global'
  AND NOT EXISTS (
    SELECT 1 FROM "PlatformSettings" AS existing
    WHERE existing."id" = 'singleton'
  );
