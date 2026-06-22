-- ============================================================
-- One-time migration: add email column + bcrypt all passwords
-- MySQL 8.0 compatible (no ADD COLUMN IF NOT EXISTS)
-- ============================================================

USE clinic_flow_erp;

-- 1. Add email column to users if not already present
SET @col1 = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE `users` ADD COLUMN `email` VARCHAR(255) NULL UNIQUE AFTER `phone`',
    'SELECT ''users.email already exists'' AS info'
  )
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'email'
);
PREPARE s1 FROM @col1; EXECUTE s1; DEALLOCATE PREPARE s1;

-- 2. Add email column to patient_accounts if not already present
SET @col2 = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE `patient_accounts` ADD COLUMN `email` VARCHAR(255) NULL UNIQUE AFTER `phone`',
    'SELECT ''patient_accounts.email already exists'' AS info'
  )
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'patient_accounts' AND COLUMN_NAME = 'email'
);
PREPARE s2 FROM @col2; EXECUTE s2; DEALLOCATE PREPARE s2;

-- 3. Backfill email from phone for seeded staff/doctor accounts
UPDATE `users`
SET `email` = CONCAT(`phone`, '@healtech.local')
WHERE `email` IS NULL;

-- 4. Backfill email from phone for seeded patient accounts
UPDATE `patient_accounts`
SET `email` = CONCAT(`phone`, '@healtech.local')
WHERE `email` IS NULL;

-- 5. Re-hash all plain-text '1' passwords in users
UPDATE `users`
SET `password_hash` = '$2b$10$NIXixdQw9mZ9mOOoHiRAYO3IEtun4hVqbiDKFfmglzeV.zw6pSFYy'
WHERE `password_hash` = '1';

-- 6. Re-hash all plain-text or dummy passwords in patient_accounts
UPDATE `patient_accounts`
SET `password_hash` = '$2b$10$GC/J4tPG3y6f43OKFUkwjOux8OoLPT2uftW0YVO9mJcJcoSzr1AtC'
WHERE `password_hash` NOT LIKE '$2b$10$%'
   OR `password_hash` LIKE '%dummyhash%';

-- Done. Test login credentials (email = phone@healtech.local, password = 1):
--   Doctor  (004): 004@healtech.local / 1
--   Staff   (008): 008@healtech.local / 1
--   Patient (0797551612): 0797551612@healtech.local / 1
