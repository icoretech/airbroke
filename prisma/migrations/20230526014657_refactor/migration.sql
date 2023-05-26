-- CreateTable
CREATE TABLE "projects" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "organization" TEXT NOT NULL DEFAULT 'myorg',
    "repo_provider" TEXT NOT NULL DEFAULT 'github',
    "repo_provider_api_key" TEXT,
    "repo_provider_api_secret" TEXT,
    "repo_branch" TEXT NOT NULL DEFAULT 'main',
    "repo_issue_tracker" TEXT,
    "repo_url" TEXT,
    "notices_count" BIGINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notices" (
    "id" BIGSERIAL NOT NULL,
    "project_id" BIGINT NOT NULL,
    "env" TEXT NOT NULL DEFAULT 'development',
    "kind" TEXT NOT NULL DEFAULT 'unknown',
    "seen_count" BIGINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "notices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "occurrences" (
    "id" BIGSERIAL NOT NULL,
    "notice_id" BIGINT NOT NULL,
    "message" TEXT NOT NULL,
    "seen_count" BIGINT NOT NULL DEFAULT 1,
    "backtrace" JSONB NOT NULL DEFAULT '{}',
    "context" JSONB NOT NULL DEFAULT '{}',
    "environment" JSONB NOT NULL DEFAULT '{}',
    "session" JSONB NOT NULL DEFAULT '{}',
    "params" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "occurrences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hourly_occurrences" (
    "id" BIGSERIAL NOT NULL,
    "occurrence_id" BIGINT NOT NULL,
    "interval_start" TIMESTAMP(6) NOT NULL,
    "interval_end" TIMESTAMP(6) NOT NULL,
    "count" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "hourly_occurrences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "occurrence_bookmarks" (
    "user_id" TEXT NOT NULL,
    "occurrence_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL
);

-- Copy data from the old tables to the new ones
INSERT INTO "projects" (
    "id",
    "name",
    "api_key",
    "organization",
    "repo_provider",
    "repo_provider_api_key",
    "repo_provider_api_secret",
    "repo_branch",
    "repo_issue_tracker",
    "repo_url",
    "notices_count",
    "created_at",
    "updated_at"
) SELECT "id", "name", "api_key", "organization", "repo_provider", "repo_provider_api_key", "repo_provider_api_secret", "repo_branch", "repo_issue_tracker", "repo_url", "notices_count", "created_at", "updated_at" FROM "project";

INSERT INTO "notices" (
    "id",
    "project_id",
    "env",
    "kind",
    "seen_count",
    "created_at",
    "updated_at"
) SELECT "id", "project_id", "env", "kind", "seen_count", "created_at", "updated_at" FROM "notice";

INSERT INTO "occurrences" (
    "id",
    "notice_id",
    "message",
    "seen_count",
    "backtrace",
    "context",
    "environment",
    "session",
    "params",
    "created_at",
    "updated_at"
) SELECT "id", "notice_id", "message", "seen_count", "backtrace", "context", "environment", "session", "params", "created_at", "updated_at" FROM "occurrence";

INSERT INTO "hourly_occurrences" (
    "id",
    "occurrence_id",
    "interval_start",
    "interval_end",
    "count"
) SELECT "id", "occurrence_id", "interval_start", "interval_end", "count" FROM "hourly_occurrence";


-- CreateIndex
CREATE UNIQUE INDEX "projects_name_key" ON "projects"("name");

-- CreateIndex
CREATE UNIQUE INDEX "projects_api_key_key" ON "projects"("api_key");

-- CreateIndex
CREATE INDEX "notices_seen_count_idx" ON "notices"("seen_count");

-- CreateIndex
CREATE INDEX "notices_updated_at_idx" ON "notices"("updated_at");

-- CreateIndex
CREATE UNIQUE INDEX "notices_project_id_env_kind_key" ON "notices"("project_id", "env", "kind");

-- CreateIndex
CREATE INDEX "occurrences_seen_count_idx" ON "occurrences"("seen_count");

-- CreateIndex
CREATE INDEX "occurrences_updated_at_idx" ON "occurrences"("updated_at");

-- CreateIndex
CREATE UNIQUE INDEX "occurrences_notice_id_message_key" ON "occurrences"("notice_id", "message");

-- CreateIndex
CREATE INDEX "hourly_occurrences_occurrence_id_interval_start_interval_en_idx" ON "hourly_occurrences"("occurrence_id", "interval_start", "interval_end");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "occurrence_bookmarks_user_id_occurrence_id_key" ON "occurrence_bookmarks"("user_id", "occurrence_id");

-- AddForeignKey
ALTER TABLE "notices" ADD CONSTRAINT "notices_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "occurrences" ADD CONSTRAINT "occurrences_notice_id_fkey" FOREIGN KEY ("notice_id") REFERENCES "notices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hourly_occurrences" ADD CONSTRAINT "hourly_occurrences_occurrence_id_fkey" FOREIGN KEY ("occurrence_id") REFERENCES "occurrences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "occurrence_bookmarks" ADD CONSTRAINT "occurrence_bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "occurrence_bookmarks" ADD CONSTRAINT "occurrence_bookmarks_occurrence_id_fkey" FOREIGN KEY ("occurrence_id") REFERENCES "occurrences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropTable
DROP TABLE "hourly_occurrence";

-- DropTable
DROP TABLE "occurrence";

-- DropTable
DROP TABLE "notice";

-- DropTable
DROP TABLE "project";

ALTER SEQUENCE "projects_id_seq" RESTART;
ALTER SEQUENCE "notices_id_seq" RESTART;
ALTER SEQUENCE "occurrences_id_seq" RESTART;
ALTER SEQUENCE "hourly_occurrences_id_seq" RESTART;
