-- Step 1: ExamAnswer'dan ExamTemplate'e olan dolaylı bağlantıyı temizle
-- (önce ExamAnswer tablosunu güncelle, sonra ExamTemplateQuestion'ı sil)

-- Exam tablosundan ExamTemplate FK'sini kaldır
ALTER TABLE "Exam" DROP CONSTRAINT IF EXISTS "Exam_templateId_fkey";

-- ExamTemplateQuestion bağımlılıklarını kaldır
ALTER TABLE "ExamTemplateQuestion" DROP CONSTRAINT IF EXISTS "ExamTemplateQuestion_templateId_fkey";
ALTER TABLE "ExamTemplateQuestion" DROP CONSTRAINT IF EXISTS "ExamTemplateQuestion_questionId_fkey";

-- Tabloları sil
DROP TABLE IF EXISTS "ExamTemplateQuestion";
DROP TABLE IF EXISTS "ExamTemplate";

-- Step 2: Exam tablosunu güncelle
ALTER TABLE "Exam" DROP COLUMN IF EXISTS "templateId";
ALTER TABLE "Exam" ADD COLUMN IF NOT EXISTS "grade" INTEGER NOT NULL DEFAULT 1;

-- Step 3: Question tablosunu güncelle
ALTER TABLE "Question" RENAME COLUMN "text" TO "content";
ALTER TABLE "Question" RENAME COLUMN "correct" TO "correctAnswer";
ALTER TABLE "Question" DROP COLUMN IF EXISTS "weights";
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "poolId" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT 'G57';
ALTER TABLE "Question" ALTER COLUMN "grade" SET NOT NULL;
ALTER TABLE "Question" ALTER COLUMN "grade" SET DEFAULT 1;

-- Step 4: ExamAnswer tablosunu güncelle
ALTER TABLE "ExamAnswer" ADD COLUMN IF NOT EXISTS "isCorrect" BOOLEAN NOT NULL DEFAULT false;

-- questionId FK ekle (yoksa)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'ExamAnswer_questionId_fkey'
    AND table_name = 'ExamAnswer'
  ) THEN
    ALTER TABLE "ExamAnswer" ADD CONSTRAINT "ExamAnswer_questionId_fkey"
      FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
