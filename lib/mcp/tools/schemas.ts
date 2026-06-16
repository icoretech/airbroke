import { z } from "zod";

export const ListProjectsArgsSchema = z.strictObject({
  search: z.string().trim().min(1).optional(),
  organization: z.string().trim().min(1).optional(),
  includePaused: z.boolean().optional().default(true),
  limit: z.coerce.number().int().min(1).max(200).optional().default(50),
  offset: z.coerce.number().int().min(0).max(10_000).optional().default(0),
});

export type ListProjectsArgs = z.infer<typeof ListProjectsArgsSchema>;

export const GetProjectArgsSchema = z.strictObject({
  project_id: z.string().min(1),
});

export type GetProjectArgs = z.infer<typeof GetProjectArgsSchema>;

export const ListNoticesArgsSchema = z.strictObject({
  project_id: z.string().min(1),
  search: z.string().trim().min(1).optional(),
  filter_by_env: z.string().trim().min(1).optional(),
  include_project: z.boolean().optional().default(false),
  include_resolved: z.boolean().optional().default(true),
  sort_attr: z
    .enum(["env", "kind", "updated_at", "seen_count"])
    .optional()
    .default("updated_at"),
  sort_dir: z.enum(["asc", "desc"]).optional().default("desc"),
  limit: z.coerce.number().int().min(1).max(200).optional().default(50),
  offset: z.coerce.number().int().min(0).max(10_000).optional().default(0),
});

export type ListNoticesArgs = z.infer<typeof ListNoticesArgsSchema>;

export const GetNoticeArgsSchema = z.strictObject({
  notice_id: z.string().min(1),
  include_project: z.boolean().optional().default(true),
  include_occurrence_details: z.boolean().optional().default(true),
  include_resolved: z.boolean().optional().default(true),
  backtrace_frames: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .default(5),
  latest_limit: z.coerce.number().int().min(1).max(50).optional().default(5),
  top_limit: z.coerce.number().int().min(1).max(50).optional().default(5),
});

export type GetNoticeArgs = z.infer<typeof GetNoticeArgsSchema>;

export const ListOccurrencesArgsSchema = z.strictObject({
  notice_id: z.string().min(1),
  search: z.string().trim().min(1).optional(),
  include_resolved: z.boolean().optional().default(true),
  include_details: z.boolean().optional().default(false),
  include_notice: z.boolean().optional().default(false),
  include_project: z.boolean().optional().default(false),
  backtrace_frames: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .default(5),
  sort_attr: z
    .enum(["updated_at", "seen_count"])
    .optional()
    .default("updated_at"),
  sort_dir: z.enum(["asc", "desc"]).optional().default("desc"),
  limit: z.coerce.number().int().min(1).max(200).optional().default(50),
  offset: z.coerce.number().int().min(0).max(10_000).optional().default(0),
});

export type ListOccurrencesArgs = z.infer<typeof ListOccurrencesArgsSchema>;

export const GetOccurrenceArgsSchema = z.strictObject({
  occurrence_id: z.string().min(1),
  include_notice: z.boolean().optional().default(true),
  include_project: z.boolean().optional().default(true),
});

export type GetOccurrenceArgs = z.infer<typeof GetOccurrenceArgsSchema>;

export const SearchArgsSchema = z.strictObject({
  query: z.string().trim().min(1),
  organization: z.string().trim().min(1).optional(),
  project_id: z.string().min(1).optional(),
  env: z.string().trim().min(1).optional(),
  include_resolved: z.boolean().optional().default(true),
  include_details: z.boolean().optional().default(false),
  backtrace_frames: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .default(5),
  limit: z.coerce.number().int().min(1).max(200).optional().default(50),
  offset: z.coerce.number().int().min(0).max(10_000).optional().default(0),
});

export type SearchArgs = z.infer<typeof SearchArgsSchema>;

export const GetSetupGuideArgsSchema = z.strictObject({
  project_id: z.string().min(1).optional(),
  sdk: z
    .enum(["airbrake", "sentry"])
    .optional()
    .describe("Filter by SDK family: 'airbrake' or 'sentry'. Omit for all."),
  framework: z
    .string()
    .trim()
    .min(1)
    .optional()
    .describe(
      "Filter by framework/language name (case-insensitive partial match, e.g. 'ruby', 'node', 'python', 'go', 'sentry browser').",
    ),
});

export type GetSetupGuideArgs = z.infer<typeof GetSetupGuideArgsSchema>;
