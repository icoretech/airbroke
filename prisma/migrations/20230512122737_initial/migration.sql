-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citext";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "project" (
    "id" BIGSERIAL NOT NULL,
    "name" CITEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "organization" TEXT NOT NULL DEFAULT 'myorg',
    "repo_provider" TEXT NOT NULL DEFAULT 'github',
    "repo_provider_api_key" TEXT,
    "repo_provider_api_secret" TEXT,
    "repo_branch" TEXT NOT NULL DEFAULT 'main',
    "repo_issue_tracker" TEXT,
    "notices_count" BIGINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notice" (
    "id" BIGSERIAL NOT NULL,
    "project_id" BIGINT NOT NULL,
    "env" CITEXT NOT NULL DEFAULT 'development',
    "kind" CITEXT NOT NULL DEFAULT 'unknown',
    "seen_count" BIGINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "notice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "occurrence" (
    "id" BIGSERIAL NOT NULL,
    "notice_id" BIGINT NOT NULL,
    "message" CITEXT,
    "seen_count" BIGINT NOT NULL DEFAULT 1,
    "backtrace" JSONB DEFAULT '{}',
    "context" JSONB DEFAULT '{}',
    "environment" JSONB DEFAULT '{}',
    "session" JSONB DEFAULT '{}',
    "params" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "occurrence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hourly_occurrence" (
    "id" BIGSERIAL NOT NULL,
    "occurrence_id" BIGINT NOT NULL,
    "interval_start" TIMESTAMP(6) NOT NULL,
    "interval_end" TIMESTAMP(6) NOT NULL,
    "count" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "hourly_occurrence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_name_key" ON "project"("name");

-- CreateIndex
CREATE UNIQUE INDEX "project_api_key_key" ON "project"("api_key");

-- CreateIndex
CREATE INDEX "notice_seen_count_idx" ON "notice"("seen_count");

-- CreateIndex
CREATE INDEX "notice_updated_at_idx" ON "notice"("updated_at");

-- CreateIndex
CREATE UNIQUE INDEX "notice_project_id_env_kind_key" ON "notice"("project_id", "env", "kind");

-- CreateIndex
CREATE INDEX "occurrence_seen_count_idx" ON "occurrence"("seen_count");

-- CreateIndex
CREATE INDEX "occurrence_updated_at_idx" ON "occurrence"("updated_at");

-- CreateIndex
CREATE UNIQUE INDEX "occurrence_notice_id_message_key" ON "occurrence"("notice_id", "message");

-- CreateIndex
CREATE INDEX "hourly_occurrence_occurrence_id_interval_start_interval_end_idx" ON "hourly_occurrence"("occurrence_id", "interval_start", "interval_end");

-- AddForeignKey
ALTER TABLE "notice" ADD CONSTRAINT "notice_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "occurrence" ADD CONSTRAINT "occurrence_notice_id_fkey" FOREIGN KEY ("notice_id") REFERENCES "notice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hourly_occurrence" ADD CONSTRAINT "hourly_occurrence_occurrence_id_fkey" FOREIGN KEY ("occurrence_id") REFERENCES "occurrence"("id") ON DELETE CASCADE ON UPDATE CASCADE;
