-- Question modeli güncellemesi
-- 1. poolId → poolNumber (rename)
-- 2. poolType kolonu eklendi (T1 = tek doğru cevap)
-- 3. weights kolonu kaldırıldı (ağırlıklar artık lib/scoring.ts POOL_WEIGHTS sabitinde)
-- 4. grade opsiyonel yapıldı

ALTER TABLE "Question" RENAME COLUMN "poolId" TO "poolNumber";

ALTER TABLE "Question" ADD COLUMN "poolType" TEXT NOT NULL DEFAULT 'T1';

-- weights kolonu varsa kaldır (yeni kurulumda zaten yok)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Question' AND column_name = 'weights'
  ) THEN
    ALTER TABLE "Question" DROP COLUMN "weights";
  END IF;
END $$;

-- grade'i opsiyonel yap (zaten nullable olabilir, sadece NOT NULL kısıtı varsa kaldır)
ALTER TABLE "Question" ALTER COLUMN "grade" DROP NOT NULL;
