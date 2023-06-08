# Changelog

## 1.1.30 (2023-06-08)


### Features

* **.drone.jsonnet:** add trigger configuration to only run pipeline on edge branch ([0320927](https://github.com/icoretech/airbroke/commit/03209279ef766508b9a13f682f81d2a229ae12d5))
* **ActionsMenu.tsx:** add ProjectActionsMenu component to display project actions menu with links to project overview and API key configuration pages ([f17e9ab](https://github.com/icoretech/airbroke/commit/f17e9ab4c767000b1122b00b4962bab3b9bf1986))
* add @testing-library/jest-dom/extend-expect import to testSetup.ts to extend jest-dom matchers ([c2a9cd6](https://github.com/icoretech/airbroke/commit/c2a9cd69090c44f701963fcff46fbec5fb49a5c0))
* add authentication! ([64e76bf](https://github.com/icoretech/airbroke/commit/64e76bfbaea56ea04cb0573fe311108fe7ee79cc))
* add bookmarks table to allow users to bookmark occurrences ([f17e9ab](https://github.com/icoretech/airbroke/commit/f17e9ab4c767000b1122b00b4962bab3b9bf1986))
* add DangerZone component to Overview page to handle project deletion and notice deletion ([2680907](https://github.com/icoretech/airbroke/commit/2680907d92ff042f812796c4c08a061160efc4a6))
* add getHourlyOccurrenceRateForLast14Days function to calculate hourly occurrence rate for last 14 days ([821c96b](https://github.com/icoretech/airbroke/commit/821c96bac1b0ba5030201a1e5e4b41c919279d3d))
* add getProjectById query function to fetch a single project by ID ([78adf7a](https://github.com/icoretech/airbroke/commit/78adf7af91b2e06b860e00695549cc4fdbae97c5))
* add icons to project edit page tabs to improve UX and make it easier to identify each tab ([78adf7a](https://github.com/icoretech/airbroke/commit/78adf7af91b2e06b860e00695549cc4fdbae97c5))
* add logo to NextAuth theme options to display custom logo on login page ([fc1987a](https://github.com/icoretech/airbroke/commit/fc1987a6d44587a201d5a9399e7e3bdd1ef35c85))
* add npm-check-updates scripts to package.json to check and update dependencies ([b13c66d](https://github.com/icoretech/airbroke/commit/b13c66df9383c44fd6326641f8c4ff5926f64c11))
* add Render YAML configuration file to deploy airbroke app on Render platform with a free web service and a free database service ([14ccad6](https://github.com/icoretech/airbroke/commit/14ccad617f5baf421e299e5ca46fecde635809c9))
* add revalidate constant to pages and components to improve Next.js ISR performance ([b0d1b5a](https://github.com/icoretech/airbroke/commit/b0d1b5a524fda77ada5880e4dfa21e024a888e4a))
* add selectedProject prop to SidebarDesktop component in multiple pages to display the selected project's information in the sidebar ([03bff56](https://github.com/icoretech/airbroke/commit/03bff56b30227a2f00aded71d765caeba322257d))
* add SidebarOpenButton and SidebarCloseButton components to enable opening and closing the sidebar on mobile devices ([fc1987a](https://github.com/icoretech/airbroke/commit/fc1987a6d44587a201d5a9399e7e3bdd1ef35c85))
* add support for displaying hourly occurrence rate in Overview component ([821c96b](https://github.com/icoretech/airbroke/commit/821c96bac1b0ba5030201a1e5e4b41c919279d3d))
* add support for pausing and resuming projects, refs https://github.com/icoretech/airbroke/issues/52 ([2680907](https://github.com/icoretech/airbroke/commit/2680907d92ff042f812796c4c08a061160efc4a6))
* add support for sending test exceptions to Airbrake JS and Airbrake Node ([78adf7a](https://github.com/icoretech/airbroke/commit/78adf7af91b2e06b860e00695549cc4fdbae97c5))
* add test_next_data volume to docker-compose.yml to persist .next folder between test runs ([c2a9cd6](https://github.com/icoretech/airbroke/commit/c2a9cd69090c44f701963fcff46fbec5fb49a5c0))
* add user, account, session, and verification token tables to support authentication and authorization ([f17e9ab](https://github.com/icoretech/airbroke/commit/f17e9ab4c767000b1122b00b4962bab3b9bf1986))
* **ai/route.ts:** add support for AIRBROKE_OPENAI_ORGANIZATION environment variable to be able to use OpenAI API with organization key ([7eba281](https://github.com/icoretech/airbroke/commit/7eba2810457280fa5722b9820038e9f7ee07823e))
* **ai/route.ts:** add support for closing the writer when no more data is expected to be received ([3b93d23](https://github.com/icoretech/airbroke/commit/3b93d232648dd56c767fabf0a341bfd378317119))
* **api, factories, app:** update table names to plural form to follow convention and improve semantics. Add a new page for displaying a notice's occurrences. ([f17e9ab](https://github.com/icoretech/airbroke/commit/f17e9ab4c767000b1122b00b4962bab3b9bf1986))
* **app/_actions.ts:** add sendAirbrakeNodeException function to send test exception to Airbrake using Node.js ([8aa0ccd](https://github.com/icoretech/airbroke/commit/8aa0ccd8dce81bc5962933470285ffe6a73eabbf))
* **app/_actions.ts:** parse repository URL using parseGitURL function and use parsed data to create project ([9f8abc5](https://github.com/icoretech/airbroke/commit/9f8abc54620acefc83a14ef88c8813cc15a0069d))
* **app/projects/[project_id]/page.tsx:** display repository provider on project page ([9f8abc5](https://github.com/icoretech/airbroke/commit/9f8abc54620acefc83a14ef88c8813cc15a0069d))
* **auth.ts:** add authentication providers and callbacks ([64e76bf](https://github.com/icoretech/airbroke/commit/64e76bfbaea56ea04cb0573fe311108fe7ee79cc))
* **auth.ts:** add support for AIRBROKE_AZURE_AD_CLIENT_ID and AIRBROKE_AZURE_AD_CLIENT_SECRET environment variables to configure Azure AD client ID and secret respectively ([97e5acf](https://github.com/icoretech/airbroke/commit/97e5acf5cc4ec44b4481d7bef57df65f0e4c7e1f))
* **auth.ts:** add support for AIRBROKE_AZURE_AD_TENANT_ID environment variable to configure Azure AD tenant ID ([97e5acf](https://github.com/icoretech/airbroke/commit/97e5acf5cc4ec44b4481d7bef57df65f0e4c7e1f))
* **auth.ts:** add support for AIRBROKE_COGNITO_ISSUER environment variable to configure Cognito issuer ([97e5acf](https://github.com/icoretech/airbroke/commit/97e5acf5cc4ec44b4481d7bef57df65f0e4c7e1f))
* **auth.ts:** add support for AIRBROKE_GITHUB_ORGS environment variable to restrict access to specific organization(s) in Github ([97e5acf](https://github.com/icoretech/airbroke/commit/97e5acf5cc4ec44b4481d7bef57df65f0e4c7e1f))
* **auth.ts:** add support for AIRBROKE_KEYCLOAK_ISSUER environment variable to configure Keycloak issuer ([97e5acf](https://github.com/icoretech/airbroke/commit/97e5acf5cc4ec44b4481d7bef57df65f0e4c7e1f))
* **BackgroundNogrid.tsx:** add new component for background with no grid pattern and gradient background ([2fecefa](https://github.com/icoretech/airbroke/commit/2fecefad45ee7d3bccf6122be1f34208f51132ed))
* **Backtrace.tsx:** add plain text copy button to backtrace component ([19e9746](https://github.com/icoretech/airbroke/commit/19e974622c2e3e97da93e95888539633c24b88e6))
* **bookmark button:** add bookmark button component to allow users to bookmark or remove bookmark from an occurrence ([e5b8f61](https://github.com/icoretech/airbroke/commit/e5b8f610af61c9d5561c1e9bc5d360f675070538))
* **bookmarks, notices, sidebar:** add bookmarks page to sidebar, add search functionality to bookmarks and notices pages, refactor OccurrencesTable to receive occurrencesIds instead of occurrences, add id to jwt token to persist user id across sessions, add types to next-auth session to include user id, add next-auth.d.ts to include types, update tsconfig.json to include next-auth.d.ts file. ([dadc61b](https://github.com/icoretech/airbroke/commit/dadc61b62c9c3a9f57bd2b968cb870f20b9d5f80))
* **bookmarks:** replace OccurrencesTable with BookmarksTable component to display bookmarks and improve search functionality ([7b869f8](https://github.com/icoretech/airbroke/commit/7b869f88d7927e6d39a2caafbf0671d74c2c8a74))
* **build.yml:** add support for latest tag to be enabled only on main branch builds ([784fde5](https://github.com/icoretech/airbroke/commit/784fde564b52300dc63632519303c609c5b499b0))
* **build.yml:** set latest tag for all images ([6a2534d](https://github.com/icoretech/airbroke/commit/6a2534d02d77d2174e3c6ae5ac60b90abb6b1237))
* **CodeTemplate.tsx:** add copy to clipboard functionality to code snippets to improve user experience ([9476f27](https://github.com/icoretech/airbroke/commit/9476f270ae441ac46ad931c14715897d16dbc178))
* **CodeTemplate.tsx:** add name prop to CodeTemplate component to display language name ([2f43399](https://github.com/icoretech/airbroke/commit/2f43399ad2ba9257734985998f90cb824e481590))
* **components/NoData.tsx:** add button to send test exception to Airbrake using Node.js ([8aa0ccd](https://github.com/icoretech/airbroke/commit/8aa0ccd8dce81bc5962933470285ffe6a73eabbf))
* **ConfirmationDialog.tsx:** add support for deleting all errors associated with a project ([b0d1b5a](https://github.com/icoretech/airbroke/commit/b0d1b5a524fda77ada5880e4dfa21e024a888e4a))
* **Context.tsx:** add horizontal scrolling to occurrence context display to improve usability when displaying large objects ([937b03a](https://github.com/icoretech/airbroke/commit/937b03a6cc3e7c8863beae3aa808d25653491835))
* **DangerZone.tsx:** add toggle intake component to danger zone card, closes https://github.com/icoretech/airbroke/issues/52 ([b28a057](https://github.com/icoretech/airbroke/commit/b28a057a2ee5cc8dd504c73f7e90758486a6c188))
* **Filter.tsx:** add filter component to allow filtering notices by environment ([ff818ac](https://github.com/icoretech/airbroke/commit/ff818ac9a8fde2e46447f96ec7c506006db2c813))
* **Form.tsx:** add button to create a project without a repository and handle form submission when no repository is provided ([198cb3d](https://github.com/icoretech/airbroke/commit/198cb3dd5be3aaa90ec96921352ab7f0a3df4b0a))
* **Form.tsx:** add support for repository URL input field to create a project with a specific repository ([9f8abc5](https://github.com/icoretech/airbroke/commit/9f8abc54620acefc83a14ef88c8813cc15a0069d))
* **generate-release.yml:** add versioning-strategy field to always bump patch version on release generation ([4a4e948](https://github.com/icoretech/airbroke/commit/4a4e94867911dee6034470149e97179399258960))
* **gitProvider.ts:** add support for more Git repository providers and refactor composeFileUrl function to use the new fields in the Project model ([9029584](https://github.com/icoretech/airbroke/commit/902958451fddfa4b40a50ec9c6366185d9d63187))
* **gitProvider.ts:** remove ProviderName type and add composeRepoUrl function to generate repo url ([9f8abc5](https://github.com/icoretech/airbroke/commit/9f8abc54620acefc83a14ef88c8813cc15a0069d))
* **Gravatar.tsx:** add Gravatar component to display user avatar based on email address ([26c72fb](https://github.com/icoretech/airbroke/commit/26c72fb46afc3cd0da033d3d71a1e666d1da8716))
* **HomeButton.tsx:** add LoginButton and LogoutButton components ([64e76bf](https://github.com/icoretech/airbroke/commit/64e76bfbaea56ea04cb0573fe311108fe7ee79cc))
* **layout.tsx, page.tsx, occurrences/page.tsx, notices/page.tsx, projects/[project_id]/page.tsx:** wrap main content with SidebarProvider component to provide sidebar state to children components ([fc1987a](https://github.com/icoretech/airbroke/commit/fc1987a6d44587a201d5a9399e7e3bdd1ef35c85))
* **middleware.ts:** add middleware to protect all routes except for API and static files ([64e76bf](https://github.com/icoretech/airbroke/commit/64e76bfbaea56ea04cb0573fe311108fe7ee79cc))
* **migration.sql:** add migration to make repo_branch field optional in projects table ([c528e80](https://github.com/icoretech/airbroke/commit/c528e806a7577ee39db2f2f07ed478e072fb5f0d))
* **migration.sql:** add triggers and functions to increment/decrement project notices count and update hourly occurrences count on occurrence creation and deletion ([a9bd229](https://github.com/icoretech/airbroke/commit/a9bd22959288060107e6c02b27075654629fba22))
* **migration.sql:** refactor database schema to improve performance and add new features, including new tables for accounts, sessions, users, and occurrence bookmarks. Copy data from old tables to new ones. Add foreign key constraints and create new indexes. Drop old tables. ([f17e9ab](https://github.com/icoretech/airbroke/commit/f17e9ab4c767000b1122b00b4962bab3b9bf1986))
* **next.config.js:** add @airbrake/node to serverComponentsExternalPackages in experimental configuration ([8aa0ccd](https://github.com/icoretech/airbroke/commit/8aa0ccd8dce81bc5962933470285ffe6a73eabbf))
* **next.config.js:** add external packages to serverComponentsExternalPackages option in experimental config ([64e76bf](https://github.com/icoretech/airbroke/commit/64e76bfbaea56ea04cb0573fe311108fe7ee79cc))
* **next.config.js:** add old routes for occurrences and notices ([844729c](https://github.com/icoretech/airbroke/commit/844729cdbf2fd4a0eaa2fe0223e3c3b659149a2f))
* **next.config.js:** add remotePatterns to images configuration to allow loading images from external sources ([26c72fb](https://github.com/icoretech/airbroke/commit/26c72fb46afc3cd0da033d3d71a1e666d1da8716))
* **next.config.js:** add support for imgur.com domain in images configuration to allow image loading from imgur.com domain ([151290a](https://github.com/icoretech/airbroke/commit/151290a6681cd2ef4a20c1857524bdd175906f15))
* **next.config.js:** enable typedRoutes experimental feature ([f17e9ab](https://github.com/icoretech/airbroke/commit/f17e9ab4c767000b1122b00b4962bab3b9bf1986))
* **NoData.tsx:** add optional showHeader prop to conditionally render header in NoData component ([8216b8d](https://github.com/icoretech/airbroke/commit/8216b8d15552d388b98612dc3f134a6806c1c956))
* **NoData.tsx:** add support for sending test exception to Airbrake to verify integration ([9e7b49d](https://github.com/icoretech/airbroke/commit/9e7b49d2de183a413c708a0b350bb5e4531d3c71))
* **notices.ts:** add getNoticeEnvs function to retrieve unique envs for a given project ID ([4535dfa](https://github.com/icoretech/airbroke/commit/4535dfa2edab50f10c699f447aba446ad3fb3d19))
* **notices:** add new route for creating notices and refactor existing routes to use it ([e05bd1b](https://github.com/icoretech/airbroke/commit/e05bd1bbe8d215e6b09a666456cc8c1f71e7c84a))
* **notices:** experimental revalidation of project path after creating a new notice ([c05c6d0](https://github.com/icoretech/airbroke/commit/c05c6d0055e5744115b89b1164045ab94078ea5c))
* **occurrence actions:** add functions to create and remove occurrence bookmarks and revalidate bookmarks page after bookmarking or removing bookmark from an occurrence ([e5b8f61](https://github.com/icoretech/airbroke/commit/e5b8f610af61c9d5561c1e9bc5d360f675070538))
* **occurrence page:** add bookmark button to occurrence page to allow users to bookmark occurrences, closes https://github.com/icoretech/airbroke/issues/36 ([e5b8f61](https://github.com/icoretech/airbroke/commit/e5b8f610af61c9d5561c1e9bc5d360f675070538))
* **occurrence page:** replace prisma query with getOccurrenceById function in occurrence page and related components to improve code semantics and readability ([3fbd15c](https://github.com/icoretech/airbroke/commit/3fbd15c954a4e522224a91a29cd13f8b9bd20e3c))
* **occurrence/[occurrence_id]/page.tsx:** add generateMetadata function to set the page title to the occurrence message ([e42676e](https://github.com/icoretech/airbroke/commit/e42676e08eb6aed94e221d7880551bbb59c3c366))
* **occurrence/[occurrence_id]/page.tsx:** add Occurrence page component with tabs to display occurrence details and related data ([f17e9ab](https://github.com/icoretech/airbroke/commit/f17e9ab4c767000b1122b00b4962bab3b9bf1986))
* **occurrenceActions.ts:** add performReplay function to replay HTTP requests ([a460c94](https://github.com/icoretech/airbroke/commit/a460c94adc1f1bd751a6af566af4d180c1971e5d))
* **occurrenceActions.ts:** add revalidation of occurrence path when creating or removing a bookmark to keep data up to date ([bc0739a](https://github.com/icoretech/airbroke/commit/bc0739ac6fef104b0201ae1d650c356a53ecd2cf))
* **occurrence:** add occurrenceUtils module with flattenObject function to flatten nested objects into an array of key-value pairs ([119d983](https://github.com/icoretech/airbroke/commit/119d9837c3e05bfc5160e07d94522c37adcd1d11))
* **occurrence:** add resolve button to occurrence page and table to allow users to mark an occurrence as resolved or reinstate it, refs https://github.com/icoretech/airbroke/issues/33 ([b6ce009](https://github.com/icoretech/airbroke/commit/b6ce009bbba92277cf0384512202762e8b51194f))
* **occurrence:** add resolved_at field to occurrence model to track when an occurrence was resolved ([b6ce009](https://github.com/icoretech/airbroke/commit/b6ce009bbba92277cf0384512202762e8b51194f))
* **occurrenceBookmarks.ts:** add checkOccurrenceBookmarkExistence function to check if a bookmark exists for a given user and occurrence ID ([e5b8f61](https://github.com/icoretech/airbroke/commit/e5b8f610af61c9d5561c1e9bc5d360f675070538))
* **occurrenceBookmarks:** add function to fetch occurrence bookmarks based on provided search parameters ([7b869f8](https://github.com/icoretech/airbroke/commit/7b869f88d7927e6d39a2caafbf0671d74c2c8a74))
* **OccurrenceChart.tsx:** add custom colors to chart bars and labels ([0112e7c](https://github.com/icoretech/airbroke/commit/0112e7c15e0e8aafc5e0acdb3fbafba1ecc80cbf))
* **OccurrenceChart.tsx:** add custom grid and label colors to chart scales ([0112e7c](https://github.com/icoretech/airbroke/commit/0112e7c15e0e8aafc5e0acdb3fbafba1ecc80cbf))
* **OccurrenceChart.tsx:** add custom tooltip styles to chart ([0112e7c](https://github.com/icoretech/airbroke/commit/0112e7c15e0e8aafc5e0acdb3fbafba1ecc80cbf))
* **OccurrenceChart.tsx:** add hover colors to chart bars ([0112e7c](https://github.com/icoretech/airbroke/commit/0112e7c15e0e8aafc5e0acdb3fbafba1ecc80cbf))
* **OccurrenceChart.tsx:** convert data to Chart.js format and add options ([dc100ec](https://github.com/icoretech/airbroke/commit/dc100ec59927317772974385de3feea05cd7427d))
* **OccurrenceChart.tsx:** remove chart legend ([0112e7c](https://github.com/icoretech/airbroke/commit/0112e7c15e0e8aafc5e0acdb3fbafba1ecc80cbf))
* **OccurrenceChartWrapper.tsx:** add margin bottom to chart title for better spacing ([0112e7c](https://github.com/icoretech/airbroke/commit/0112e7c15e0e8aafc5e0acdb3fbafba1ecc80cbf))
* **OccurrenceChartWrapper:** add charts ([56e6c60](https://github.com/icoretech/airbroke/commit/56e6c6091e04c8d75a638a6f3a75d7deffc54323))
* **occurrences.ts:** add cached function to fetch a single occurrence by ID ([78adf7a](https://github.com/icoretech/airbroke/commit/78adf7af91b2e06b860e00695549cc4fdbae97c5))
* **occurrences.ts:** add function to fetch occurrences based on provided search parameters ([78adf7a](https://github.com/icoretech/airbroke/commit/78adf7af91b2e06b860e00695549cc4fdbae97c5))
* **OccurrencesChartWrapper.tsx:** create new component to display hourly occurrence chart for a list of occurrence ids ([b0d1b5a](https://github.com/icoretech/airbroke/commit/b0d1b5a524fda77ada5880e4dfa21e024a888e4a))
* **Overview.tsx:** add chart section to display hourly occurrences in the past 14 days ([b0d1b5a](https://github.com/icoretech/airbroke/commit/b0d1b5a524fda77ada5880e4dfa21e024a888e4a))
* **Overview.tsx:** add confirmation dialogs to delete project and delete all errors for a project ([f17e9ab](https://github.com/icoretech/airbroke/commit/f17e9ab4c767000b1122b00b4962bab3b9bf1986))
* **Overview.tsx:** add new section for repository information and display relevant project information in the component ([2f43399](https://github.com/icoretech/airbroke/commit/2f43399ad2ba9257734985998f90cb824e481590))
* **Overview.tsx:** add project status to project overview ([b28a057](https://github.com/icoretech/airbroke/commit/b28a057a2ee5cc8dd504c73f7e90758486a6c188))
* **Overview.tsx:** add statistics section to display project statistics ([b0d1b5a](https://github.com/icoretech/airbroke/commit/b0d1b5a524fda77ada5880e4dfa21e024a888e4a))
* **Overview.tsx:** add Test Zone section to Overview component and use NoData component to display message when no exceptions are recorded ([8216b8d](https://github.com/icoretech/airbroke/commit/8216b8d15552d388b98612dc3f134a6806c1c956))
* **package.json:** add @airbrake/node dependency to the project ([8aa0ccd](https://github.com/icoretech/airbroke/commit/8aa0ccd8dce81bc5962933470285ffe6a73eabbf))
* **package.json:** add @next-auth/prisma-adapter dependency ([f17e9ab](https://github.com/icoretech/airbroke/commit/f17e9ab4c767000b1122b00b4962bab3b9bf1986))
* **package.json:** add server-only package to be able to use server-only imports in client code ([26c72fb](https://github.com/icoretech/airbroke/commit/26c72fb46afc3cd0da033d3d71a1e666d1da8716))
* **package.json:** update next-auth and octokit dependencies to latest versions to improve security and functionality ([64e76bf](https://github.com/icoretech/airbroke/commit/64e76bfbaea56ea04cb0573fe311108fe7ee79cc))
* **page.tsx, Backtrace.tsx, ClipboardButton.tsx:** add CustomTimeAgo component to display occurrence creation and update time, add ClipboardButton component to copy occurrence backtrace to clipboard ([4eaf18a](https://github.com/icoretech/airbroke/commit/4eaf18a26c382825f6fae05b3eff60b9be60702e))
* **page.tsx:** add authentication check to HomePage component ([64e76bf](https://github.com/icoretech/airbroke/commit/64e76bfbaea56ea04cb0573fe311108fe7ee79cc))
* **page.tsx:** add Filter component to page and pass unique environment array to it, update NoticesTable component to receive searchParams object instead of individual props ([ff818ac](https://github.com/icoretech/airbroke/commit/ff818ac9a8fde2e46447f96ec7c506006db2c813))
* **page.tsx:** add first seen and last seen timestamps to occurrence page to provide more information to users ([2b65784](https://github.com/icoretech/airbroke/commit/2b657845e27d4f085fe557358084982d7bff3184))
* **page.tsx:** add occurrence seen count to the occurrence header to provide more information about the occurrence ([5a07370](https://github.com/icoretech/airbroke/commit/5a07370894dba81f03311e9e5190a2cd434a6d35))
* **page.tsx:** add select clause to occurrence query to only retrieve the id field ([1acb18f](https://github.com/icoretech/airbroke/commit/1acb18f38a487ac1eabd1eaf2464e3f3684a9ae8))
* **page.tsx:** add sticky header to ProjectHeader component to improve user experience ([06cfd70](https://github.com/icoretech/airbroke/commit/06cfd701f5c1fed1257e60c4a2eabc68dd77d111))
* **page.tsx:** add support for rendering environment, session and params tabs only if occurrence has respective properties ([c0322ed](https://github.com/icoretech/airbroke/commit/c0322ed023cb3b3c86e4842ed0116285e53ecaa0))
* **page.tsx:** add support for search query parameter to filter projects by name ([f17e9ab](https://github.com/icoretech/airbroke/commit/f17e9ab4c767000b1122b00b4962bab3b9bf1986))
* **page.tsx:** add tab navigation to occurrence page for easier access to different occurrence details ([69b52e0](https://github.com/icoretech/airbroke/commit/69b52e0df26893450d58ec874dfbb701e9c6fb31))
* **page.tsx:** mobile tabs, refs https://github.com/icoretech/airbroke/issues/24 ([58fa86b](https://github.com/icoretech/airbroke/commit/58fa86bdb213ed414f2e8ed12e1303d02b28af0d))
* **page.tsx:** remove occurrence page component as it is no longer used in the application ([f17e9ab](https://github.com/icoretech/airbroke/commit/f17e9ab4c767000b1122b00b4962bab3b9bf1986))
* **page.tsx:** replace logo.png with logo.svg to improve page loading performance and add support for svg images ([26c72fb](https://github.com/icoretech/airbroke/commit/26c72fb46afc3cd0da033d3d71a1e666d1da8716))
* **page.tsx:** responsive tabs in project edit, closes https://github.com/icoretech/airbroke/issues/24 ([6f16168](https://github.com/icoretech/airbroke/commit/6f161681bc07413ee1996a1af892b08ec1637809))
* **parseGitUrl.ts:** add parseGitURL function to parse git repository urls ([9f8abc5](https://github.com/icoretech/airbroke/commit/9f8abc54620acefc83a14ef88c8813cc15a0069d))
* **prisma/migrations:** make several columns on occurrence table required by removing NOT NULL constraint ([f17e9ab](https://github.com/icoretech/airbroke/commit/f17e9ab4c767000b1122b00b4962bab3b9bf1986))
* **prisma/seed.ts:** use generateUniqueProjectKey function to generate project key instead of randomBytes ([9f8abc5](https://github.com/icoretech/airbroke/commit/9f8abc54620acefc83a14ef88c8813cc15a0069d))
* **projectActions.ts:** add functionality to create a project without a repository when no data is provided ([198cb3d](https://github.com/icoretech/airbroke/commit/198cb3dd5be3aaa90ec96921352ab7f0a3df4b0a))
* **project:** add Edit component to allow users to edit project information, closes https://github.com/icoretech/airbroke/issues/14 ([c528e80](https://github.com/icoretech/airbroke/commit/c528e806a7577ee39db2f2f07ed478e072fb5f0d))
* **project:** add Overview component to display project overview information ([46a30c1](https://github.com/icoretech/airbroke/commit/46a30c189a437c0a10cb0d451d56cfa7c8ec881d))
* **project:** add repo_url field to project model ([9f8abc5](https://github.com/icoretech/airbroke/commit/9f8abc54620acefc83a14ef88c8813cc15a0069d))
* **projects.ts:** add updateProject function to update project data with form data ([c528e80](https://github.com/icoretech/airbroke/commit/c528e806a7577ee39db2f2f07ed478e072fb5f0d))
* **projects.ts:** add zod, zod-error, and zod-form-data dependencies to validate form data ([c528e80](https://github.com/icoretech/airbroke/commit/c528e806a7577ee39db2f2f07ed478e072fb5f0d))
* **ProjectsTable.tsx:** add hover effect to project list items to improve user experience ([4836b38](https://github.com/icoretech/airbroke/commit/4836b382deb289dc66e4d1a4af1e71e26c168076))
* **ProviderIcon.tsx:** add new icons for GitKraken, Gitea, Gogs, and Gitter ([2f43399](https://github.com/icoretech/airbroke/commit/2f43399ad2ba9257734985998f90cb824e481590))
* **public:** add company logo in SVG format to the public directory of the project ([26c72fb](https://github.com/icoretech/airbroke/commit/26c72fb46afc3cd0da033d3d71a1e666d1da8716))
* **public:** add demo gif to be used in the README file ([9b43dd7](https://github.com/icoretech/airbroke/commit/9b43dd7c2e753d7bc82f893923c7d8f953f44f44))
* **queries/notices.ts:** add function to get all notice IDs for a given projectId ([b0d1b5a](https://github.com/icoretech/airbroke/commit/b0d1b5a524fda77ada5880e4dfa21e024a888e4a))
* **queries/projects.ts:** add getProjects function to fetch projects from the database based on optional search term, refs https://github.com/icoretech/airbroke/issues/41 ([65aa1db](https://github.com/icoretech/airbroke/commit/65aa1db18a78203619553a10dca4195b134f3892))
* **queries/projects.ts:** add getProjectsGroupedByOrganization function to fetch projects grouped by organization from the database ([65aa1db](https://github.com/icoretech/airbroke/commit/65aa1db18a78203619553a10dca4195b134f3892))
* **README.md:** add occurrence charts to the list of features ([1e57e84](https://github.com/icoretech/airbroke/commit/1e57e8439dcc661acd225a9e2f39499f79f89a0a))
* **README.md:** add OpenNext section to explain how to deploy on AWS using Serverless Framework plugin ([8aa0ccd](https://github.com/icoretech/airbroke/commit/8aa0ccd8dce81bc5962933470285ffe6a73eabbf))
* **README.md:** replace old logo with new logo and update title to reflect the change ([83e2437](https://github.com/icoretech/airbroke/commit/83e2437178506d9baeddadc0db9b4c43c1722244))
* **render.yaml:** add environment variables for NextAuth.js configuration ([d17e4a0](https://github.com/icoretech/airbroke/commit/d17e4a076dee1d1ca1be317f6ac968be3ee8f4e8))
* **Replay.tsx:** display response body in case of non-OK HTTP status code, and display a message for OK responses ([955c1b7](https://github.com/icoretech/airbroke/commit/955c1b76336a9a04cdc8f915d805fd136a58f8e2))
* **route.ts:** add authentication middleware to auth route ([64e76bf](https://github.com/icoretech/airbroke/commit/64e76bfbaea56ea04cb0573fe311108fe7ee79cc))
* **route.ts:** add check for paused project, refs https://github.com/icoretech/airbroke/issues/52 ([04de396](https://github.com/icoretech/airbroke/commit/04de396c904f95e0331c2ed330442db72e68bcc9))
* **schema.prisma:** make repo_branch field optional ([c528e80](https://github.com/icoretech/airbroke/commit/c528e806a7577ee39db2f2f07ed478e072fb5f0d))
* **SessionButtons.tsx:** add LoginButton and LogoutButton components to handle user authentication ([26c72fb](https://github.com/icoretech/airbroke/commit/26c72fb46afc3cd0da033d3d71a1e666d1da8716))
* **SidebarButtons.tsx:** create SidebarOpenButton component to render a button to open the sidebar on mobile devices ([fc1987a](https://github.com/icoretech/airbroke/commit/fc1987a6d44587a201d5a9399e7e3bdd1ef35c85))
* **SidebarDesktop.tsx:** add Gravatar component to display user avatar in the LogoutButton component and remove HomeButton component ([26c72fb](https://github.com/icoretech/airbroke/commit/26c72fb46afc3cd0da033d3d71a1e666d1da8716))
* **SidebarDesktop.tsx:** add LogoutButton component to user profile section ([64e76bf](https://github.com/icoretech/airbroke/commit/64e76bfbaea56ea04cb0573fe311108fe7ee79cc))
* **SidebarDesktop.tsx:** add TbClockPause icon to show when a project is paused in the sidebar, refs https://github.com/icoretech/airbroke/issues/52 ([d71c7ad](https://github.com/icoretech/airbroke/commit/d71c7ad5c2e0aac28971813d286753070ba13729))
* **SidebarDesktop.tsx:** pass repo_provider prop to ProviderIcon component to display correct icon ([9f8abc5](https://github.com/icoretech/airbroke/commit/9f8abc54620acefc83a14ef88c8813cc15a0069d))
* **SidebarDesktop.tsx:** replace TbBrandGithub with ProviderIcon component to support multiple repo providers ([9f8abc5](https://github.com/icoretech/airbroke/commit/9f8abc54620acefc83a14ef88c8813cc15a0069d))
* **SidebarMobile.tsx, SidebarDesktop.tsx:** create SidebarMobile and SidebarDesktop components to render sidebar content based on screen size ([fc1987a](https://github.com/icoretech/airbroke/commit/fc1987a6d44587a201d5a9399e7e3bdd1ef35c85))
* **SidebarProvider.tsx:** create SidebarProvider component to manage sidebar state and provide it to children components ([fc1987a](https://github.com/icoretech/airbroke/commit/fc1987a6d44587a201d5a9399e7e3bdd1ef35c85))
* **Sort.tsx, page.tsx:** add sorting functionality to the project notices page and refactor the page to use tabs for better navigation and organization ([f17e9ab](https://github.com/icoretech/airbroke/commit/f17e9ab4c767000b1122b00b4962bab3b9bf1986))
* **Sort.tsx:** remove unused SortDirection import and update toggleSort function to use searchParams object ([ff818ac](https://github.com/icoretech/airbroke/commit/ff818ac9a8fde2e46447f96ec7c506006db2c813))
* **tailwind.config.ts:** add airbroke color palette to the theme configuration ([97e5acf](https://github.com/icoretech/airbroke/commit/97e5acf5cc4ec44b4481d7bef57df65f0e4c7e1f))
* **ToggleIntake.tsx:** add toggle intake component to allow pausing and resuming of project data intake ([b28a057](https://github.com/icoretech/airbroke/commit/b28a057a2ee5cc8dd504c73f7e90758486a6c188))
* **Toolbox.tsx, Curl.tsx, curl.png:** add cURL command generator to Toolbox component ([ae4f75d](https://github.com/icoretech/airbroke/commit/ae4f75db526123cf85b2c1b82a5657704380a20e))


### Bug Fixes

* **_actions.ts:** catch errors thrown by revalidatePath calls to prevent app from crashing ([d67c7e0](https://github.com/icoretech/airbroke/commit/d67c7e0af581b3ebb9ab6b42f5f8c133e5ca4f59))
* **.env.dist:** change COGNITO_ISSUER variable name to AIRBROKE_COGNITO_ISSUER to match the naming convention of other variables ([0215ac1](https://github.com/icoretech/airbroke/commit/0215ac1de3527e08573decd7c84cca2be11f4070))
* add invalidateProjectsCache, invalidateProjectCache and invalidateAllProjectCache functions to invalidate cache when a project is deleted or paused ([2680907](https://github.com/icoretech/airbroke/commit/2680907d92ff042f812796c4c08a061160efc4a6))
* add paused column to projects table in migration file ([2680907](https://github.com/icoretech/airbroke/commit/2680907d92ff042f812796c4c08a061160efc4a6))
* add paused field to Project model in Prisma schema ([2680907](https://github.com/icoretech/airbroke/commit/2680907d92ff042f812796c4c08a061160efc4a6))
* add type import for SortAttribute and SortDirection in project page component to avoid type errors ([78adf7a](https://github.com/icoretech/airbroke/commit/78adf7af91b2e06b860e00695549cc4fdbae97c5))
* adjust font color of title in Danger Zone section in Overview component ([821c96b](https://github.com/icoretech/airbroke/commit/821c96bac1b0ba5030201a1e5e4b41c919279d3d))
* adjust font color of title in Hourly Occurrences section in Overview component ([821c96b](https://github.com/icoretech/airbroke/commit/821c96bac1b0ba5030201a1e5e4b41c919279d3d))
* adjust unit of occurrence count in Overview component to be more accurate ([821c96b](https://github.com/icoretech/airbroke/commit/821c96bac1b0ba5030201a1e5e4b41c919279d3d))
* adjust wording of ConfirmationDialog component in Overview component to be more accurate ([821c96b](https://github.com/icoretech/airbroke/commit/821c96bac1b0ba5030201a1e5e4b41c919279d3d))
* adjust wording of Danger Zone section in Overview component to be more accurate ([821c96b](https://github.com/icoretech/airbroke/commit/821c96bac1b0ba5030201a1e5e4b41c919279d3d))
* adjust wording of NoData component in Overview component to be more accurate ([821c96b](https://github.com/icoretech/airbroke/commit/821c96bac1b0ba5030201a1e5e4b41c919279d3d))
* adjust wording of occurrence rate in Overview component to be more accurate ([821c96b](https://github.com/icoretech/airbroke/commit/821c96bac1b0ba5030201a1e5e4b41c919279d3d))
* adjust wording of Repository Information section in Overview component to be more accurate ([821c96b](https://github.com/icoretech/airbroke/commit/821c96bac1b0ba5030201a1e5e4b41c919279d3d))
* adjust wording of Test Zone section in Overview component to be more accurate ([821c96b](https://github.com/icoretech/airbroke/commit/821c96bac1b0ba5030201a1e5e4b41c919279d3d))
* **AI.tsx:** add console.log to log errors that occur when connection is closed due to an error ([9e7b49d](https://github.com/icoretech/airbroke/commit/9e7b49d2de183a413c708a0b350bb5e4531d3c71))
* **airbrakeActions.ts:** change projectId parameter type from bigint to string to match the type in the database ([f17e9ab](https://github.com/icoretech/airbroke/commit/f17e9ab4c767000b1122b00b4962bab3b9bf1986))
* **ai:** replace escaped newlines with actual newlines in the client-side event listener to display the data correctly ([53d9f09](https://github.com/icoretech/airbroke/commit/53d9f09515ff8c3bba2f01331768f3b39139fcd8))
* **app/_actions.ts:** import Notifier from @airbrake/node to use it in sendAirbrakeNodeException function ([8aa0ccd](https://github.com/icoretech/airbroke/commit/8aa0ccd8dce81bc5962933470285ffe6a73eabbf))
* **app/_actions.ts:** validate project name against new regex that allows dashes, underscores, and periods ([9f8abc5](https://github.com/icoretech/airbroke/commit/9f8abc54620acefc83a14ef88c8813cc15a0069d))
* **auth.ts:** remove unused parameters from signIn callback function ([a6210ca](https://github.com/icoretech/airbroke/commit/a6210ca6c807a3428e9f1258b6e7685e2a7ff7b3))
* **BacktraceLine.tsx:** handle case where fileUrl is null or undefined by rendering a span instead of a link ([3ddbef7](https://github.com/icoretech/airbroke/commit/3ddbef7e992994408cce1cc78c81c1daaf018d40))
* **bookmarks:** change revalidate time to 0 to always fetch latest bookmarks ([7b869f8](https://github.com/icoretech/airbroke/commit/7b869f88d7927e6d39a2caafbf0671d74c2c8a74))
* change error message in Airbrake JS test exception to match convention ([78adf7a](https://github.com/icoretech/airbroke/commit/78adf7af91b2e06b860e00695549cc4fdbae97c5))
* change handleDeleteProjectConfirm and handleDeleteProjectNoticesConfirm to not receive projectId as parameter ([2680907](https://github.com/icoretech/airbroke/commit/2680907d92ff042f812796c4c08a061160efc4a6))
* change project prop to projectId in ConfirmationDialog component ([2680907](https://github.com/icoretech/airbroke/commit/2680907d92ff042f812796c4c08a061160efc4a6))
* **components/BookmarksTable.tsx:** fix occurrence link href to use occurrence_id instead of occurrence.id ([e42676e](https://github.com/icoretech/airbroke/commit/e42676e08eb6aed94e221d7880551bbb59c3c366))
* **ConfirmationDialog:** increase z-index to prevent overlapping with other elements ([46a30c1](https://github.com/icoretech/airbroke/commit/46a30c189a437c0a10cb0d451d56cfa7c8ec881d))
* **Context.tsx:** add missing space between flex-shrink-0 and font-semibold classes in div element ([3a03939](https://github.com/icoretech/airbroke/commit/3a03939d9951b7aaed42f71c74f988d932ed6429))
* **docker-compose.yml:** reduce connection limit to 8 for development database to avoid overloading the database server ([f17e9ab](https://github.com/icoretech/airbroke/commit/f17e9ab4c767000b1122b00b4962bab3b9bf1986))
* **generate-release.yml:** uncomment changelog-notes-type to enable release notes to be generated from Github ([2ec90e6](https://github.com/icoretech/airbroke/commit/2ec90e65367159908ea45b6006dfd1a0ea645d73))
* **gitProvider.ts:** return empty string instead of '#' when url is not defined in default case of switch statement ([3ddbef7](https://github.com/icoretech/airbroke/commit/3ddbef7e992994408cce1cc78c81c1daaf018d40))
* increase max_connections to 23 in db service command in docker-compose.yml to avoid connection errors ([c2a9cd6](https://github.com/icoretech/airbroke/commit/c2a9cd69090c44f701963fcff46fbec5fb49a5c0))
* **lib/actions/occurrenceActions.ts:** add error handling for session not found when creating or removing occurrence bookmarks ([e42676e](https://github.com/icoretech/airbroke/commit/e42676e08eb6aed94e221d7880551bbb59c3c366))
* **middleware.ts:** exclude /icon route from SSR to avoid conflicts with favicon route ([0167cfb](https://github.com/icoretech/airbroke/commit/0167cfb868a0269f83eef68a6205d26c695ea652))
* **NoData.tsx:** remove unused state and useEffect, create new Notifier instance inside sendTestException function ([9e7b49d](https://github.com/icoretech/airbroke/commit/9e7b49d2de183a413c708a0b350bb5e4531d3c71))
* **NoData.tsx:** rename Notifier import to AirbrakeJsNotifier to avoid naming conflicts with sendAirbrakeNodeException function ([d67c7e0](https://github.com/icoretech/airbroke/commit/d67c7e0af581b3ebb9ab6b42f5f8c133e5ca4f59))
* **OccurrenceChartWrapper.tsx:** change occurrenceId type from bigint to string to match the type of the id in the database ([400fca7](https://github.com/icoretech/airbroke/commit/400fca7cb8c2b884cdd470120bf8807255a203d0))
* **occurrenceUtils.ts:** flattenObject function now returns single string values in arrays as is to improve readability of occurrence data ([46e7596](https://github.com/icoretech/airbroke/commit/46e7596be53644cec1ddae1fc1b15e43c1116c7c))
* **page.tsx:** remove unused project_id parameter from Notice component ([a693802](https://github.com/icoretech/airbroke/commit/a69380273d43dc799ef2e7b71ff11748d6a86856))
* **page.tsx:** replace throwing error with redirect to /projects when project is not found ([dd8dc1d](https://github.com/icoretech/airbroke/commit/dd8dc1dcb948c29be2790c74a740fdf965c12b67))
* **processError:** auto reinstate an occurrence when it is processed again ([b6ce009](https://github.com/icoretech/airbroke/commit/b6ce009bbba92277cf0384512202762e8b51194f))
* **project:** display 'Not set' for repository URL and main branch if they are not set ([c528e80](https://github.com/icoretech/airbroke/commit/c528e806a7577ee39db2f2f07ed478e072fb5f0d))
* remove unused import in airbrakeActions ([78adf7a](https://github.com/icoretech/airbroke/commit/78adf7af91b2e06b860e00695549cc4fdbae97c5))
* **route.ts:** add authentication check to GET method ([64e76bf](https://github.com/icoretech/airbroke/commit/64e76bfbaea56ea04cb0573fe311108fe7ee79cc))
* **route.ts:** add console.error to log errors that occur while processing response ([9e7b49d](https://github.com/icoretech/airbroke/commit/9e7b49d2de183a413c708a0b350bb5e4531d3c71))
* **route.ts:** handle error and close writer in finally block to ensure proper cleanup ([9ca0ca9](https://github.com/icoretech/airbroke/commit/9ca0ca9f5b7f070a5794d94a3518fc8b85582b10))
* **SidebarDesktop.tsx:** update link href to use a relative path instead of an absolute path ([0167cfb](https://github.com/icoretech/airbroke/commit/0167cfb868a0269f83eef68a6205d26c695ea652))
* toggleProjectPausedStatus function to toggle paused status of a project ([2680907](https://github.com/icoretech/airbroke/commit/2680907d92ff042f812796c4c08a061160efc4a6))
* update logo URL in NextAuth theme options to point to the correct image location ([fc1987a](https://github.com/icoretech/airbroke/commit/fc1987a6d44587a201d5a9399e7e3bdd1ef35c85))
* update revalidatePath calls to point to project page instead of notices page to avoid 404 errors ([d13bf38](https://github.com/icoretech/airbroke/commit/d13bf385ec336e500c0c40a6359d6a049d2c70fb))

## [1.1.29](https://github.com/icoretech/airbroke/compare/v1.1.28...v1.1.29) (2023-06-06)


### Features

* **page.tsx:** responsive tabs in project edit, closes https://github.com/icoretech/airbroke/issues/24 ([8c24e9a](https://github.com/icoretech/airbroke/commit/8c24e9a92d94416dc347ef56f1630b868a0195a2))

## [1.1.28](https://github.com/icoretech/airbroke/compare/v1.1.27...v1.1.28) (2023-06-06)


### Features

* add @testing-library/jest-dom/extend-expect import to testSetup.ts to extend jest-dom matchers ([1a5793a](https://github.com/icoretech/airbroke/commit/1a5793a21a718ff19a6f5494996f7a33965a7ab8))
* add test_next_data volume to docker-compose.yml to persist .next folder between test runs ([1a5793a](https://github.com/icoretech/airbroke/commit/1a5793a21a718ff19a6f5494996f7a33965a7ab8))
* **migration.sql:** add migration to make repo_branch field optional in projects table ([ae4eea2](https://github.com/icoretech/airbroke/commit/ae4eea2ce4eb84ae17cbabf1cfc1eb3ae41fba34))
* **page.tsx:** mobile tabs, refs https://github.com/icoretech/airbroke/issues/24 ([8a3d7a1](https://github.com/icoretech/airbroke/commit/8a3d7a1f57add1ee5d035b8e5f59cd6346cc40db))
* **project:** add Edit component to allow users to edit project information, closes https://github.com/icoretech/airbroke/issues/14 ([ae4eea2](https://github.com/icoretech/airbroke/commit/ae4eea2ce4eb84ae17cbabf1cfc1eb3ae41fba34))
* **projects.ts:** add updateProject function to update project data with form data ([ae4eea2](https://github.com/icoretech/airbroke/commit/ae4eea2ce4eb84ae17cbabf1cfc1eb3ae41fba34))
* **projects.ts:** add zod, zod-error, and zod-form-data dependencies to validate form data ([ae4eea2](https://github.com/icoretech/airbroke/commit/ae4eea2ce4eb84ae17cbabf1cfc1eb3ae41fba34))
* **schema.prisma:** make repo_branch field optional ([ae4eea2](https://github.com/icoretech/airbroke/commit/ae4eea2ce4eb84ae17cbabf1cfc1eb3ae41fba34))


### Bug Fixes

* increase max_connections to 23 in db service command in docker-compose.yml to avoid connection errors ([1a5793a](https://github.com/icoretech/airbroke/commit/1a5793a21a718ff19a6f5494996f7a33965a7ab8))
* **project:** display 'Not set' for repository URL and main branch if they are not set ([ae4eea2](https://github.com/icoretech/airbroke/commit/ae4eea2ce4eb84ae17cbabf1cfc1eb3ae41fba34))

## [1.1.27](https://github.com/icoretech/airbroke/compare/v1.1.26...v1.1.27) (2023-06-05)


### Features

* add npm-check-updates scripts to package.json to check and update dependencies ([44cb9ee](https://github.com/icoretech/airbroke/commit/44cb9ee228ebec66cb491beaf94d45601cf95aeb))
* **Backtrace.tsx:** add plain text copy button to backtrace component ([92c2345](https://github.com/icoretech/airbroke/commit/92c2345cb84d14f3cfb2982542b94a45bf90bec5))
* **DangerZone.tsx:** add toggle intake component to danger zone card, closes https://github.com/icoretech/airbroke/issues/52 ([9fe283a](https://github.com/icoretech/airbroke/commit/9fe283ab7aaac16736e861b245ae3fdef5c8caca))
* **Overview.tsx:** add project status to project overview ([9fe283a](https://github.com/icoretech/airbroke/commit/9fe283ab7aaac16736e861b245ae3fdef5c8caca))
* **ToggleIntake.tsx:** add toggle intake component to allow pausing and resuming of project data intake ([9fe283a](https://github.com/icoretech/airbroke/commit/9fe283ab7aaac16736e861b245ae3fdef5c8caca))

## [1.1.26](https://github.com/icoretech/airbroke/compare/v1.1.25...v1.1.26) (2023-05-31)


### Features

* **Form.tsx:** add button to create a project without a repository and handle form submission when no repository is provided ([00073de](https://github.com/icoretech/airbroke/commit/00073de29b10966d35d900a6c309cbd23de91483))
* **projectActions.ts:** add functionality to create a project without a repository when no data is provided ([00073de](https://github.com/icoretech/airbroke/commit/00073de29b10966d35d900a6c309cbd23de91483))

## [1.1.25](https://github.com/icoretech/airbroke/compare/v1.1.24...v1.1.25) (2023-05-31)


### Features

* **ai/route.ts:** add support for AIRBROKE_OPENAI_ORGANIZATION environment variable to be able to use OpenAI API with organization key ([7543903](https://github.com/icoretech/airbroke/commit/7543903f90f658acb336c6f3eaa2945aab1aac62))

## [1.1.24](https://github.com/icoretech/airbroke/compare/v1.1.23...v1.1.24) (2023-05-29)


### Features

* **gitProvider.ts:** add support for more Git repository providers and refactor composeFileUrl function to use the new fields in the Project model ([62147cf](https://github.com/icoretech/airbroke/commit/62147cfdd0bdf091f1fe8bf021bc6db32dbcc6be))


### Bug Fixes

* **BacktraceLine.tsx:** handle case where fileUrl is null or undefined by rendering a span instead of a link ([18da703](https://github.com/icoretech/airbroke/commit/18da70345feabd38c05ae026e4cda75f35140c8a))
* **gitProvider.ts:** return empty string instead of '#' when url is not defined in default case of switch statement ([18da703](https://github.com/icoretech/airbroke/commit/18da70345feabd38c05ae026e4cda75f35140c8a))

## [1.1.23](https://github.com/icoretech/airbroke/compare/v1.1.22...v1.1.23) (2023-05-29)


### Features

* add DangerZone component to Overview page to handle project deletion and notice deletion ([366ba8f](https://github.com/icoretech/airbroke/commit/366ba8fa8c00523e790c326bb27afa04308c35c5))
* add support for pausing and resuming projects, refs https://github.com/icoretech/airbroke/issues/52 ([366ba8f](https://github.com/icoretech/airbroke/commit/366ba8fa8c00523e790c326bb27afa04308c35c5))
* **notices:** experimental revalidation of project path after creating a new notice ([44901da](https://github.com/icoretech/airbroke/commit/44901da5ba8ec6a6d87d168446cdcbb71b6ba770))
* **page.tsx:** add first seen and last seen timestamps to occurrence page to provide more information to users ([e38a74d](https://github.com/icoretech/airbroke/commit/e38a74d0ead5035171b9e418308b64c37e128f33))
* **route.ts:** add check for paused project, refs https://github.com/icoretech/airbroke/issues/52 ([b819e04](https://github.com/icoretech/airbroke/commit/b819e04f5b954b1607a544090519758bbbf05092))
* **SidebarDesktop.tsx:** add TbClockPause icon to show when a project is paused in the sidebar, refs https://github.com/icoretech/airbroke/issues/52 ([eb6755d](https://github.com/icoretech/airbroke/commit/eb6755d65b2f43e7363608b5b5c8dcca6e71ecc9))


### Bug Fixes

* add invalidateProjectsCache, invalidateProjectCache and invalidateAllProjectCache functions to invalidate cache when a project is deleted or paused ([366ba8f](https://github.com/icoretech/airbroke/commit/366ba8fa8c00523e790c326bb27afa04308c35c5))
* add paused column to projects table in migration file ([366ba8f](https://github.com/icoretech/airbroke/commit/366ba8fa8c00523e790c326bb27afa04308c35c5))
* add paused field to Project model in Prisma schema ([366ba8f](https://github.com/icoretech/airbroke/commit/366ba8fa8c00523e790c326bb27afa04308c35c5))
* change handleDeleteProjectConfirm and handleDeleteProjectNoticesConfirm to not receive projectId as parameter ([366ba8f](https://github.com/icoretech/airbroke/commit/366ba8fa8c00523e790c326bb27afa04308c35c5))
* change project prop to projectId in ConfirmationDialog component ([366ba8f](https://github.com/icoretech/airbroke/commit/366ba8fa8c00523e790c326bb27afa04308c35c5))
* toggleProjectPausedStatus function to toggle paused status of a project ([366ba8f](https://github.com/icoretech/airbroke/commit/366ba8fa8c00523e790c326bb27afa04308c35c5))

## [1.1.22](https://github.com/icoretech/airbroke/compare/v1.1.21...v1.1.22) (2023-05-28)


### Features

* **page.tsx:** add support for rendering environment, session and params tabs only if occurrence has respective properties ([2a8eadd](https://github.com/icoretech/airbroke/commit/2a8eaddb2a8504547f0ee9b66be2461100328d8a))


### Bug Fixes

* **occurrenceUtils.ts:** flattenObject function now returns single string values in arrays as is to improve readability of occurrence data ([4494628](https://github.com/icoretech/airbroke/commit/4494628bdf39ad2f92a2cee3ec410c3c6ce35c74))

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
