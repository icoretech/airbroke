-- CreateTable
CREATE TABLE "remarks" (
    "id" TEXT NOT NULL,
    "notice_id" TEXT NOT NULL,
    "occurrence_id" TEXT,
    "user_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "remarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "remarks_notice_id_idx" ON "remarks"("notice_id");

-- CreateIndex
CREATE INDEX "remarks_occurrence_id_idx" ON "remarks"("occurrence_id");

-- CreateIndex
CREATE INDEX "remarks_created_at_idx" ON "remarks"("created_at");

-- AddForeignKey
ALTER TABLE "remarks" ADD CONSTRAINT "remarks_notice_id_fkey" FOREIGN KEY ("notice_id") REFERENCES "notices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remarks" ADD CONSTRAINT "remarks_occurrence_id_fkey" FOREIGN KEY ("occurrence_id") REFERENCES "occurrences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remarks" ADD CONSTRAINT "remarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
