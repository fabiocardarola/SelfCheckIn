-- MySQL 8. Run on the target database before deploying hhapi.
-- Existing rows stay blank: residence must not be inferred in the database.
SET @sci_sql = IF(EXISTS(
    SELECT 1 FROM information_schema.columns
    WHERE table_schema=DATABASE() AND table_name='complaints' AND column_name='psres'
), 'SELECT 1', 'ALTER TABLE complaints ADD COLUMN psres VARCHAR(9) NOT NULL DEFAULT ''''');
PREPARE sci_migration FROM @sci_sql;
EXECUTE sci_migration;
DEALLOCATE PREPARE sci_migration;

SELECT column_name, column_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema=DATABASE() AND table_name='complaints' AND column_name='psres';
