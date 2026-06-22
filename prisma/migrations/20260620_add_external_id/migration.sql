-- Question modeline externalId eklendi
-- orijinal matroskop soru ID'sini saklar — tekrar çalıştırıldığında duplicate oluşmaz

ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "externalId" INTEGER;

CREATE UNIQUE INDEX IF NOT EXISTS "Question_externalId_key" ON "Question"("externalId");
