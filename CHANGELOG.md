# Changelog

## [1.1.21](https://github.com/icoretech/airbroke/compare/v1.1.20...v1.1.21) (2023-05-28)


### Features

* **Context.tsx:** add horizontal scrolling to occurrence context display to improve usability when displaying large objects ([1ba9ef8](https://github.com/icoretech/airbroke/commit/1ba9ef8884b4289b8a3d6be30ddcff818f0ebd52))


### Bug Fixes

* **Context.tsx:** add missing space between flex-shrink-0 and font-semibold classes in div element ([1711f4c](https://github.com/icoretech/airbroke/commit/1711f4c5fc112c6183a4ea5972e463227047596c))
* **page.tsx:** replace throwing error with redirect to /projects when project is not found ([2a893e1](https://github.com/icoretech/airbroke/commit/2a893e17b2a3115b15942bd58796c6a8f772d4f0))

## [1.1.20](https://github.com/icoretech/airbroke/compare/v1.1.19...v1.1.20) (2023-05-28)


### Features

* **occurrence/[occurrence_id]/page.tsx:** add generateMetadata function to set the page title to the occurrence message ([c9f53cb](https://github.com/icoretech/airbroke/commit/c9f53cb37b97920c060d1e170874358e6a624ca8))


### Bug Fixes

* **components/BookmarksTable.tsx:** fix occurrence link href to use occurrence_id instead of occurrence.id ([c9f53cb](https://github.com/icoretech/airbroke/commit/c9f53cb37b97920c060d1e170874358e6a624ca8))
* **lib/actions/occurrenceActions.ts:** add error handling for session not found when creating or removing occurrence bookmarks ([c9f53cb](https://github.com/icoretech/airbroke/commit/c9f53cb37b97920c060d1e170874358e6a624ca8))

## [1.1.19](https://github.com/icoretech/airbroke/compare/v1.1.18...v1.1.19) (2023-05-28)


### Features

* **Filter.tsx:** add filter component to allow filtering notices by environment ([8bead37](https://github.com/icoretech/airbroke/commit/8bead37ceb54531805429a9d3d5a38a46fa12a0d))
* **notices.ts:** add getNoticeEnvs function to retrieve unique envs for a given project ID ([1386274](https://github.com/icoretech/airbroke/commit/1386274dba3eeeaac04c3661e1006fbb37b36d4e))
* **page.tsx:** add Filter component to page and pass unique environment array to it, update NoticesTable component to receive searchParams object instead of individual props ([8bead37](https://github.com/icoretech/airbroke/commit/8bead37ceb54531805429a9d3d5a38a46fa12a0d))
* **Sort.tsx:** remove unused SortDirection import and update toggleSort function to use searchParams object ([8bead37](https://github.com/icoretech/airbroke/commit/8bead37ceb54531805429a9d3d5a38a46fa12a0d))

## [1.1.18](https://github.com/icoretech/airbroke/compare/v1.1.17...v1.1.18) (2023-05-28)


### Features

* add getHourlyOccurrenceRateForLast14Days function to calculate hourly occurrence rate for last 14 days ([5974d4d](https://github.com/icoretech/airbroke/commit/5974d4dc5417cbf596db6a9d0388340bbd613f0c))
* add revalidate constant to pages and components to improve Next.js ISR performance ([0307ccc](https://github.com/icoretech/airbroke/commit/0307ccc6a7640e365e6ce42a757dd65c366de2b2))
* add support for displaying hourly occurrence rate in Overview component ([5974d4d](https://github.com/icoretech/airbroke/commit/5974d4dc5417cbf596db6a9d0388340bbd613f0c))
* **ConfirmationDialog.tsx:** add support for deleting all errors associated with a project ([0307ccc](https://github.com/icoretech/airbroke/commit/0307ccc6a7640e365e6ce42a757dd65c366de2b2))
* **occurrenceActions.ts:** add revalidation of occurrence path when creating or removing a bookmark to keep data up to date ([e7e73bc](https://github.com/icoretech/airbroke/commit/e7e73bc7665d230ebb63959d58f3fbd024c4ccb5))
* **OccurrencesChartWrapper.tsx:** create new component to display hourly occurrence chart for a list of occurrence ids ([0307ccc](https://github.com/icoretech/airbroke/commit/0307ccc6a7640e365e6ce42a757dd65c366de2b2))
* **Overview.tsx:** add chart section to display hourly occurrences in the past 14 days ([0307ccc](https://github.com/icoretech/airbroke/commit/0307ccc6a7640e365e6ce42a757dd65c366de2b2))
* **Overview.tsx:** add statistics section to display project statistics ([0307ccc](https://github.com/icoretech/airbroke/commit/0307ccc6a7640e365e6ce42a757dd65c366de2b2))
* **queries/notices.ts:** add function to get all notice IDs for a given projectId ([0307ccc](https://github.com/icoretech/airbroke/commit/0307ccc6a7640e365e6ce42a757dd65c366de2b2))


### Bug Fixes

* adjust font color of title in Danger Zone section in Overview component ([5974d4d](https://github.com/icoretech/airbroke/commit/5974d4dc5417cbf596db6a9d0388340bbd613f0c))
* adjust font color of title in Hourly Occurrences section in Overview component ([5974d4d](https://github.com/icoretech/airbroke/commit/5974d4dc5417cbf596db6a9d0388340bbd613f0c))
* adjust unit of occurrence count in Overview component to be more accurate ([5974d4d](https://github.com/icoretech/airbroke/commit/5974d4dc5417cbf596db6a9d0388340bbd613f0c))
* adjust wording of ConfirmationDialog component in Overview component to be more accurate ([5974d4d](https://github.com/icoretech/airbroke/commit/5974d4dc5417cbf596db6a9d0388340bbd613f0c))
* adjust wording of Danger Zone section in Overview component to be more accurate ([5974d4d](https://github.com/icoretech/airbroke/commit/5974d4dc5417cbf596db6a9d0388340bbd613f0c))
* adjust wording of NoData component in Overview component to be more accurate ([5974d4d](https://github.com/icoretech/airbroke/commit/5974d4dc5417cbf596db6a9d0388340bbd613f0c))
* adjust wording of occurrence rate in Overview component to be more accurate ([5974d4d](https://github.com/icoretech/airbroke/commit/5974d4dc5417cbf596db6a9d0388340bbd613f0c))
* adjust wording of Repository Information section in Overview component to be more accurate ([5974d4d](https://github.com/icoretech/airbroke/commit/5974d4dc5417cbf596db6a9d0388340bbd613f0c))
* adjust wording of Test Zone section in Overview component to be more accurate ([5974d4d](https://github.com/icoretech/airbroke/commit/5974d4dc5417cbf596db6a9d0388340bbd613f0c))

## [1.1.17](https://github.com/icoretech/airbroke/compare/v1.1.16...v1.1.17) (2023-05-27)


### Features

* **bookmark button:** add bookmark button component to allow users to bookmark or remove bookmark from an occurrence ([4957165](https://github.com/icoretech/airbroke/commit/49571656d0b4ffd53e0dd060d521e0d8a087bb55))
* **occurrence actions:** add functions to create and remove occurrence bookmarks and revalidate bookmarks page after bookmarking or removing bookmark from an occurrence ([4957165](https://github.com/icoretech/airbroke/commit/49571656d0b4ffd53e0dd060d521e0d8a087bb55))
* **occurrence page:** add bookmark button to occurrence page to allow users to bookmark occurrences, closes https://github.com/icoretech/airbroke/issues/36 ([4957165](https://github.com/icoretech/airbroke/commit/49571656d0b4ffd53e0dd060d521e0d8a087bb55))
* **occurrenceBookmarks.ts:** add checkOccurrenceBookmarkExistence function to check if a bookmark exists for a given user and occurrence ID ([4957165](https://github.com/icoretech/airbroke/commit/49571656d0b4ffd53e0dd060d521e0d8a087bb55))

## [1.1.16](https://github.com/icoretech/airbroke/compare/v1.1.15...v1.1.16) (2023-05-27)


### Features

* add getProjectById query function to fetch a single project by ID ([ea6844c](https://github.com/icoretech/airbroke/commit/ea6844c413046924877fd39a4574a925f4bdac54))
* add icons to project edit page tabs to improve UX and make it easier to identify each tab ([ea6844c](https://github.com/icoretech/airbroke/commit/ea6844c413046924877fd39a4574a925f4bdac54))
* add support for sending test exceptions to Airbrake JS and Airbrake Node ([ea6844c](https://github.com/icoretech/airbroke/commit/ea6844c413046924877fd39a4574a925f4bdac54))
* **bookmarks:** replace OccurrencesTable with BookmarksTable component to display bookmarks and improve search functionality ([26a6c0a](https://github.com/icoretech/airbroke/commit/26a6c0aa41509267ae09bdf6f0f062779f98489b))
* **NoData.tsx:** add optional showHeader prop to conditionally render header in NoData component ([2f73cc6](https://github.com/icoretech/airbroke/commit/2f73cc64e673541340e86cf081bc94abd7c8021c))
* **occurrence page:** replace prisma query with getOccurrenceById function in occurrence page and related components to improve code semantics and readability ([2fba1fa](https://github.com/icoretech/airbroke/commit/2fba1fa8af97a0ba7ca76f8a8186ef516e709520))
* **occurrenceBookmarks:** add function to fetch occurrence bookmarks based on provided search parameters ([26a6c0a](https://github.com/icoretech/airbroke/commit/26a6c0aa41509267ae09bdf6f0f062779f98489b))
* **occurrences.ts:** add cached function to fetch a single occurrence by ID ([ea6844c](https://github.com/icoretech/airbroke/commit/ea6844c413046924877fd39a4574a925f4bdac54))
* **occurrences.ts:** add function to fetch occurrences based on provided search parameters ([ea6844c](https://github.com/icoretech/airbroke/commit/ea6844c413046924877fd39a4574a925f4bdac54))
* **Overview.tsx:** add Test Zone section to Overview component and use NoData component to display message when no exceptions are recorded ([2f73cc6](https://github.com/icoretech/airbroke/commit/2f73cc64e673541340e86cf081bc94abd7c8021c))
* **public:** add demo gif to be used in the README file ([e2fc24c](https://github.com/icoretech/airbroke/commit/e2fc24ce064b7970dbe3e19eebb716f6d211d425))
* **queries/projects.ts:** add getProjects function to fetch projects from the database based on optional search term, refs https://github.com/icoretech/airbroke/issues/41 ([6a2660d](https://github.com/icoretech/airbroke/commit/6a2660d6d49fd898b795d384b266da0ff664ec60))
* **queries/projects.ts:** add getProjectsGroupedByOrganization function to fetch projects grouped by organization from the database ([6a2660d](https://github.com/icoretech/airbroke/commit/6a2660d6d49fd898b795d384b266da0ff664ec60))


### Bug Fixes

* add type import for SortAttribute and SortDirection in project page component to avoid type errors ([ea6844c](https://github.com/icoretech/airbroke/commit/ea6844c413046924877fd39a4574a925f4bdac54))
* **bookmarks:** change revalidate time to 0 to always fetch latest bookmarks ([26a6c0a](https://github.com/icoretech/airbroke/commit/26a6c0aa41509267ae09bdf6f0f062779f98489b))
* change error message in Airbrake JS test exception to match convention ([ea6844c](https://github.com/icoretech/airbroke/commit/ea6844c413046924877fd39a4574a925f4bdac54))
* remove unused import in airbrakeActions ([ea6844c](https://github.com/icoretech/airbroke/commit/ea6844c413046924877fd39a4574a925f4bdac54))

## [1.1.15](https://github.com/icoretech/airbroke/compare/v1.1.14...v1.1.15) (2023-05-26)


### Features

* **OccurrenceChart.tsx:** add custom colors to chart bars and labels ([211237e](https://github.com/icoretech/airbroke/commit/211237ebf11a2a5eda9187e94a2dd8eb1611fb7c))
* **OccurrenceChart.tsx:** add custom grid and label colors to chart scales ([211237e](https://github.com/icoretech/airbroke/commit/211237ebf11a2a5eda9187e94a2dd8eb1611fb7c))
* **OccurrenceChart.tsx:** add custom tooltip styles to chart ([211237e](https://github.com/icoretech/airbroke/commit/211237ebf11a2a5eda9187e94a2dd8eb1611fb7c))
* **OccurrenceChart.tsx:** add hover colors to chart bars ([211237e](https://github.com/icoretech/airbroke/commit/211237ebf11a2a5eda9187e94a2dd8eb1611fb7c))
* **OccurrenceChart.tsx:** convert data to Chart.js format and add options ([8cc5159](https://github.com/icoretech/airbroke/commit/8cc5159411925051ade73788ba681ef0bcca73fd))
* **OccurrenceChart.tsx:** remove chart legend ([211237e](https://github.com/icoretech/airbroke/commit/211237ebf11a2a5eda9187e94a2dd8eb1611fb7c))
* **OccurrenceChartWrapper.tsx:** add margin bottom to chart title for better spacing ([211237e](https://github.com/icoretech/airbroke/commit/211237ebf11a2a5eda9187e94a2dd8eb1611fb7c))

## [1.1.14](https://github.com/icoretech/airbroke/compare/v1.1.13...v1.1.14) (2023-05-26)


### Features

* **OccurrenceChartWrapper:** add charts ([378e642](https://github.com/icoretech/airbroke/commit/378e642478dfe7a76c4c8a777dd8adee29259f25))
* **page.tsx:** add select clause to occurrence query to only retrieve the id field ([7f54fbb](https://github.com/icoretech/airbroke/commit/7f54fbb0ae508e07a66f819f29fd141a1a18fe17))
* **README.md:** add occurrence charts to the list of features ([1e73036](https://github.com/icoretech/airbroke/commit/1e730366c2f1cc2581d941cd9fe8cb61daf5d943))

## [1.1.13](https://github.com/icoretech/airbroke/compare/v1.1.12...v1.1.13) (2023-05-26)


### Features

* **ActionsMenu.tsx:** add ProjectActionsMenu component to display project actions menu with links to project overview and API key configuration pages ([f1a5642](https://github.com/icoretech/airbroke/commit/f1a5642cd5f39575b483da0e7201f86ce879b49d))
* add bookmarks table to allow users to bookmark occurrences ([f1a5642](https://github.com/icoretech/airbroke/commit/f1a5642cd5f39575b483da0e7201f86ce879b49d))
* add user, account, session, and verification token tables to support authentication and authorization ([f1a5642](https://github.com/icoretech/airbroke/commit/f1a5642cd5f39575b483da0e7201f86ce879b49d))
* **api, factories, app:** update table names to plural form to follow convention and improve semantics. Add a new page for displaying a notice's occurrences. ([f1a5642](https://github.com/icoretech/airbroke/commit/f1a5642cd5f39575b483da0e7201f86ce879b49d))
* **bookmarks, notices, sidebar:** add bookmarks page to sidebar, add search functionality to bookmarks and notices pages, refactor OccurrencesTable to receive occurrencesIds instead of occurrences, add id to jwt token to persist user id across sessions, add types to next-auth session to include user id, add next-auth.d.ts to include types, update tsconfig.json to include next-auth.d.ts file. ([b06a4a9](https://github.com/icoretech/airbroke/commit/b06a4a9d7ac90a7f567d6aad0ac058a3a803338e))
* **migration.sql:** add triggers and functions to increment/decrement project notices count and update hourly occurrences count on occurrence creation and deletion ([28cbbe7](https://github.com/icoretech/airbroke/commit/28cbbe7d2a2888c2fa0b3926bbcbe84502888745))
* **migration.sql:** refactor database schema to improve performance and add new features, including new tables for accounts, sessions, users, and occurrence bookmarks. Copy data from old tables to new ones. Add foreign key constraints and create new indexes. Drop old tables. ([f1a5642](https://github.com/icoretech/airbroke/commit/f1a5642cd5f39575b483da0e7201f86ce879b49d))
* **next.config.js:** add old routes for occurrences and notices ([92c7739](https://github.com/icoretech/airbroke/commit/92c7739636dd9052768e58b0731797e0d417672b))
* **next.config.js:** enable typedRoutes experimental feature ([f1a5642](https://github.com/icoretech/airbroke/commit/f1a5642cd5f39575b483da0e7201f86ce879b49d))
* **occurrence/[occurrence_id]/page.tsx:** add Occurrence page component with tabs to display occurrence details and related data ([f1a5642](https://github.com/icoretech/airbroke/commit/f1a5642cd5f39575b483da0e7201f86ce879b49d))
* **Overview.tsx:** add confirmation dialogs to delete project and delete all errors for a project ([f1a5642](https://github.com/icoretech/airbroke/commit/f1a5642cd5f39575b483da0e7201f86ce879b49d))
* **package.json:** add @next-auth/prisma-adapter dependency ([f1a5642](https://github.com/icoretech/airbroke/commit/f1a5642cd5f39575b483da0e7201f86ce879b49d))
* **page.tsx:** add support for search query parameter to filter projects by name ([f1a5642](https://github.com/icoretech/airbroke/commit/f1a5642cd5f39575b483da0e7201f86ce879b49d))
* **page.tsx:** remove occurrence page component as it is no longer used in the application ([f1a5642](https://github.com/icoretech/airbroke/commit/f1a5642cd5f39575b483da0e7201f86ce879b49d))
* **prisma/migrations:** make several columns on occurrence table required by removing NOT NULL constraint ([f1a5642](https://github.com/icoretech/airbroke/commit/f1a5642cd5f39575b483da0e7201f86ce879b49d))
* **Sort.tsx, page.tsx:** add sorting functionality to the project notices page and refactor the page to use tabs for better navigation and organization ([f1a5642](https://github.com/icoretech/airbroke/commit/f1a5642cd5f39575b483da0e7201f86ce879b49d))


### Bug Fixes

* **airbrakeActions.ts:** change projectId parameter type from bigint to string to match the type in the database ([f1a5642](https://github.com/icoretech/airbroke/commit/f1a5642cd5f39575b483da0e7201f86ce879b49d))
* **docker-compose.yml:** reduce connection limit to 8 for development database to avoid overloading the database server ([f1a5642](https://github.com/icoretech/airbroke/commit/f1a5642cd5f39575b483da0e7201f86ce879b49d))
* **OccurrenceChartWrapper.tsx:** change occurrenceId type from bigint to string to match the type of the id in the database ([52619ec](https://github.com/icoretech/airbroke/commit/52619ec69b3935825a55623a7d10028e687c465f))
* **page.tsx:** remove unused project_id parameter from Notice component ([d6f5336](https://github.com/icoretech/airbroke/commit/d6f53369512d88131bf56cf126a7409cfc77931a))
* update revalidatePath calls to point to project page instead of notices page to avoid 404 errors ([7b359b5](https://github.com/icoretech/airbroke/commit/7b359b5446e32dfbbc6eb044c1eb6dc466457173))

## [1.1.12](https://github.com/icoretech/airbroke/compare/v1.1.11...v1.1.12) (2023-05-25)


### Features

* add Render YAML configuration file to deploy airbroke app on Render platform with a free web service and a free database service ([e345f1d](https://github.com/icoretech/airbroke/commit/e345f1dd6568b3b8085df9bd9197a1c659ddf2ff))
* **next.config.js:** add support for imgur.com domain in images configuration to allow image loading from imgur.com domain ([3b52e56](https://github.com/icoretech/airbroke/commit/3b52e5686abb7f986c2ea085249d72a0a1d38c6e))
* **occurrenceActions.ts:** add performReplay function to replay HTTP requests ([b590b2f](https://github.com/icoretech/airbroke/commit/b590b2f81a3837e007fead61851877f2b1eacf77))
* **ProjectsTable.tsx:** add hover effect to project list items to improve user experience ([6cab703](https://github.com/icoretech/airbroke/commit/6cab703459b7aac2d5157048ea3c0b544976f909))
* **render.yaml:** add environment variables for NextAuth.js configuration ([76962e7](https://github.com/icoretech/airbroke/commit/76962e7274963d56ece8f509370452f7dfaa8eaa))

## 1.1.11 (2023-05-22)

## What's Changed
* build(deps-dev): bump @types/node from 20.2.2 to 20.2.3 by @dependabot in https://github.com/icoretech/airbroke/pull/27


**Full Changelog**: https://github.com/icoretech/airbroke/compare/v1.1.10...v1.1.11

## 1.1.10 (2023-05-22)

**Full Changelog**: https://github.com/icoretech/airbroke/compare/v1.1.9...v1.1.10

## 1.1.9 (2023-05-22)

**Full Changelog**: https://github.com/icoretech/airbroke/compare/v1.1.8...v1.1.9

## 1.1.8 (2023-05-21)

**Full Changelog**: https://github.com/icoretech/airbroke/compare/v1.1.7...v1.1.8

## 1.1.7 (2023-05-21)

**Full Changelog**: https://github.com/icoretech/airbroke/compare/v1.1.6...v1.1.7

## 1.1.6 (2023-05-21)

**Full Changelog**: https://github.com/icoretech/airbroke/compare/v1.1.5...v1.1.6

## 1.1.5 (2023-05-21)

**Full Changelog**: https://github.com/icoretech/airbroke/compare/v1.1.4...v1.1.5

## 1.1.4 (2023-05-21)

**Full Changelog**: https://github.com/icoretech/airbroke/compare/v1.1.3...v1.1.4

## [1.1.3](https://github.com/icoretech/airbroke/compare/v1.1.2...v1.1.3) (2023-05-20)


### Features

* **README.md:** replace old logo with new logo and update title to reflect the change ([ace8d6d](https://github.com/icoretech/airbroke/commit/ace8d6de80444ae5116e93641ba708887336fb8e))


### Bug Fixes

* **auth.ts:** remove unused parameters from signIn callback function ([b3ede4c](https://github.com/icoretech/airbroke/commit/b3ede4c34cb8fcc8b9a33b2cbb98ffe8bed0508f))

## [1.1.2](https://github.com/icoretech/airbroke/compare/v1.1.1...v1.1.2) (2023-05-20)


### Features

* add authentication! ([8a09b4a](https://github.com/icoretech/airbroke/commit/8a09b4a90e9208b4ffc28c6c7218c6220b4bb45b))
* **auth.ts:** add authentication providers and callbacks ([8a09b4a](https://github.com/icoretech/airbroke/commit/8a09b4a90e9208b4ffc28c6c7218c6220b4bb45b))
* **build.yml:** set latest tag for all images ([2fc170a](https://github.com/icoretech/airbroke/commit/2fc170ac58ab9b843e349660157e455d734eacbb))
* **generate-release.yml:** add versioning-strategy field to always bump patch version on release generation ([7f587b8](https://github.com/icoretech/airbroke/commit/7f587b88cf6178865fc42669d2358dda47ed9626))
* **HomeButton.tsx:** add LoginButton and LogoutButton components ([8a09b4a](https://github.com/icoretech/airbroke/commit/8a09b4a90e9208b4ffc28c6c7218c6220b4bb45b))
* **middleware.ts:** add middleware to protect all routes except for API and static files ([8a09b4a](https://github.com/icoretech/airbroke/commit/8a09b4a90e9208b4ffc28c6c7218c6220b4bb45b))
* **next.config.js:** add external packages to serverComponentsExternalPackages option in experimental config ([8a09b4a](https://github.com/icoretech/airbroke/commit/8a09b4a90e9208b4ffc28c6c7218c6220b4bb45b))
* **notices:** add new route for creating notices and refactor existing routes to use it ([4a986db](https://github.com/icoretech/airbroke/commit/4a986db4aada2ee11bdde9cce7db0c82d9cba7f6))
* **package.json:** update next-auth and octokit dependencies to latest versions to improve security and functionality ([8a09b4a](https://github.com/icoretech/airbroke/commit/8a09b4a90e9208b4ffc28c6c7218c6220b4bb45b))
* **page.tsx:** add authentication check to HomePage component ([8a09b4a](https://github.com/icoretech/airbroke/commit/8a09b4a90e9208b4ffc28c6c7218c6220b4bb45b))
* **project:** add Overview component to display project overview information ([9065734](https://github.com/icoretech/airbroke/commit/90657348cf1d05460014d3fbe03b638c78559801))
* **route.ts:** add authentication middleware to auth route ([8a09b4a](https://github.com/icoretech/airbroke/commit/8a09b4a90e9208b4ffc28c6c7218c6220b4bb45b))
* **SidebarDesktop.tsx:** add LogoutButton component to user profile section ([8a09b4a](https://github.com/icoretech/airbroke/commit/8a09b4a90e9208b4ffc28c6c7218c6220b4bb45b))


### Bug Fixes

* **ConfirmationDialog:** increase z-index to prevent overlapping with other elements ([9065734](https://github.com/icoretech/airbroke/commit/90657348cf1d05460014d3fbe03b638c78559801))
* **route.ts:** add authentication check to GET method ([8a09b4a](https://github.com/icoretech/airbroke/commit/8a09b4a90e9208b4ffc28c6c7218c6220b4bb45b))

## 1.1.1 (2023-05-19)

**Full Changelog**: https://github.com/icoretech/airbroke/compare/v1.1.0...v1.1.1

## 1.1.0 (2023-05-19)

**Full Changelog**: https://github.com/icoretech/airbroke/compare/v1.0.0...v1.1.0

## 1.0.0 (2023-05-19)


### Features

* **occurrence:** add occurrenceUtils module with flattenObject function to flatten nested objects into an array of key-value pairs ([1ce5e68](https://github.com/icoretech/airbroke/commit/1ce5e68b35ec63efb0ed32fc508b2ffcc6d5fb09))
* **page.tsx:** add tab navigation to occurrence page for easier access to different occurrence details ([7f65d04](https://github.com/icoretech/airbroke/commit/7f65d04259c4fd8aba82999dc45a603390e6abea))


### Bug Fixes

* **route.ts:** handle error and close writer in finally block to ensure proper cleanup ([8ae4709](https://github.com/icoretech/airbroke/commit/8ae470900b8259c7697693a507a2a6bf8315e185))
