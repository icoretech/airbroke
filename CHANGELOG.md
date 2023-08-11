# Changelog

## [1.1.45](https://github.com/icoretech/airbroke/compare/v1.1.44...v1.1.45) (2023-08-11)


### Features

* enhance transitions for mobile sidebar ([85f483a](https://github.com/icoretech/airbroke/commit/85f483a38ca19bf81daea2fedd57005c709ee6db))
* **sidebar:** Implement hybrid approach for "Bookmarks" link active state ([70c1c62](https://github.com/icoretech/airbroke/commit/70c1c626d43092f6804cfbc6a04c4fc06af1e65b))


### Bug Fixes

* **ActionsMenu.tsx:** update z-index value in ProjectActionsMenu component to prevent overlap with other elements ([e4d9d5f](https://github.com/icoretech/airbroke/commit/e4d9d5fa0909671f8b38d997d4dbef933c272fd0))
* **deps:** update dependency next-auth to v4.22.5 ([#190](https://github.com/icoretech/airbroke/issues/190)) ([119be32](https://github.com/icoretech/airbroke/commit/119be32fc815756f6a5d76dee1d54a0a534209f7))
* **Filter.tsx:** update z-index value in Filter component to prevent overlap with other elements ([1cb0fd9](https://github.com/icoretech/airbroke/commit/1cb0fd9697e91e870774b22bf70e80d35eca41bf))

## [1.1.44](https://github.com/icoretech/airbroke/compare/v1.1.43...v1.1.44) (2023-08-07)


### Features

* **.env.dist:** update AIRBROKE_CORS_ORIGINS value to use a more generic domain name for the example browser app deployment ([36b0050](https://github.com/icoretech/airbroke/commit/36b0050bd238a3b17b912b3e9e6714dc061b7c5b))

## [1.1.43](https://github.com/icoretech/airbroke/compare/v1.1.42...v1.1.43) (2023-08-07)


### Bug Fixes

* **deps:** update dependency ai to v2.1.32 ([5efda25](https://github.com/icoretech/airbroke/commit/5efda2583fc884e4b4dfcb19d47f17c7160cf341))
* **deps:** update dependency chart.js to v4.3.3 ([e52e727](https://github.com/icoretech/airbroke/commit/e52e7275dabbd2acc277e4a87e39daf65a3158db))
* **deps:** update dependency next-auth to v4.22.4 ([8988322](https://github.com/icoretech/airbroke/commit/898832213f47e85b3dabe4eb8ab22d7779859482))
* **deps:** update prisma monorepo to v5.1.1 ([7e834ce](https://github.com/icoretech/airbroke/commit/7e834ce835516e54287fa0b7627d77251eec06ee))

## [1.1.42](https://github.com/icoretech/airbroke/compare/v1.1.41...v1.1.42) (2023-08-02)


### Bug Fixes

* **deps:** update dependency ai to v2.1.29 ([65d4f63](https://github.com/icoretech/airbroke/commit/65d4f637f7ae31e06976deaa6800b56646e73300))
* **deps:** update dependency ai to v2.1.31 ([e523954](https://github.com/icoretech/airbroke/commit/e52395416a219086670c3f3b2a38dbe9087fe04b))
* **deps:** update prisma monorepo to v5.1.0 ([adb80ab](https://github.com/icoretech/airbroke/commit/adb80abecd34ac73f262a85e8ab0f8b80265bca6))

## [1.1.41](https://github.com/icoretech/airbroke/compare/v1.1.40...v1.1.41) (2023-07-31)


### Features

* **next.config.js:** add logging configuration based on AIRBROKE_LOG_LEVEL environment variable to enable verbose logging if set to 'verbose' ([264015c](https://github.com/icoretech/airbroke/commit/264015c8b6c3df355696fe1fdc93a439f8d3728e))
* **route.ts:** update default OpenAI engine model from 'gpt-4' to 'gpt-3.5-turbo' if nothing is set ([07d4f9f](https://github.com/icoretech/airbroke/commit/07d4f9fa301227cd734dcf1fc5e5b580b739d739))


### Bug Fixes

* **deps:** update dependency @headlessui/react to v1.7.16 ([#160](https://github.com/icoretech/airbroke/issues/160)) ([44d7fa7](https://github.com/icoretech/airbroke/commit/44d7fa76daf99bf9a8b46c0ff1bebccc8f9a7111))
* **deps:** update dependency ai to v2.1.27 ([#161](https://github.com/icoretech/airbroke/issues/161)) ([3521094](https://github.com/icoretech/airbroke/commit/352109495afbd6b3d512846541408f74c4e93165))
* **deps:** update dependency ai to v2.1.28 ([9879eea](https://github.com/icoretech/airbroke/commit/9879eea1b3a05399ce0dcc62487443ac59df54a4))

## [1.1.40](https://github.com/icoretech/airbroke/compare/v1.1.39...v1.1.40) (2023-07-27)


### Features

* **not-found.tsx:** add NotFound component, this might allow next.js to skip a whole renderer process at runtime, because at the moment the 404 page is recognized as a pages app ([98a2a1c](https://github.com/icoretech/airbroke/commit/98a2a1c04187222482ec741ebcea0d290176cf00))


### Bug Fixes

* **deps:** update dependency ai to v2.1.25 ([03692c8](https://github.com/icoretech/airbroke/commit/03692c80ad18600ff5f9577864f89553ebd2ae02))
* **deps:** update dependency ai to v2.1.26 ([c036dd7](https://github.com/icoretech/airbroke/commit/c036dd7b8366c126a8305a933874697ab9183ecf))
* **deps:** update dependency chart.js to v4.3.1 ([3f190a5](https://github.com/icoretech/airbroke/commit/3f190a50a05f7650a8876a46527f2bddea130fc0))
* **deps:** update dependency chart.js to v4.3.2 ([#155](https://github.com/icoretech/airbroke/issues/155)) ([79070de](https://github.com/icoretech/airbroke/commit/79070de0755b43f68e5ccab2c691090ed82849d2))
* **deps:** update dependency octokit to v3.1.0 ([#157](https://github.com/icoretech/airbroke/issues/157)) ([1b5d24e](https://github.com/icoretech/airbroke/commit/1b5d24e2406d84b589ea0d7b5fc70db1b41d7eb7))
* **deps:** update dependency openai-edge to v1.2.2 ([#150](https://github.com/icoretech/airbroke/issues/150)) ([9b4bca3](https://github.com/icoretech/airbroke/commit/9b4bca395801624db551901b63d1aea95aa00036))

## [1.1.39](https://github.com/icoretech/airbroke/compare/v1.1.38...v1.1.39) (2023-07-21)


### Bug Fixes

* **deps:** update dependency openai-edge to v1.2.1 ([#140](https://github.com/icoretech/airbroke/issues/140)) ([919bc7a](https://github.com/icoretech/airbroke/commit/919bc7aeb756697d788027ceed1e363e4ebb72cd))

## [1.1.38](https://github.com/icoretech/airbroke/compare/v1.1.37...v1.1.38) (2023-07-20)


### Features

* **db.ts:** add support for excluding logging when running in a testing environment by checking the value of TESTING environment variable ([6123d12](https://github.com/icoretech/airbroke/commit/6123d12f3891199bd429792b9626e5bbf9299c50))


### Bug Fixes

* **Dockerfile:** update COPY commands to use --link flag ([00f957c](https://github.com/icoretech/airbroke/commit/00f957c094b071895efe1e0dd0af8a0a76f5d103))
* **route.ts:** include CORS headers in error responses to allow cross-origin requests ([08f997d](https://github.com/icoretech/airbroke/commit/08f997d25175ff32406253e25bb0a7cde8ba63d5))
* **route.ts:** include CORS headers in successful responses to allow cross-origin requests ([08f997d](https://github.com/icoretech/airbroke/commit/08f997d25175ff32406253e25bb0a7cde8ba63d5))

## [1.1.37](https://github.com/icoretech/airbroke/compare/v1.1.36...v1.1.37) (2023-07-19)


### Bug Fixes

* **deps:** update dependency ai to v2.1.21 ([7379260](https://github.com/icoretech/airbroke/commit/73792609aafab6c9ae8592fc8cfcc7a816d293b3))
* **deps:** update dependency ai to v2.1.22 ([#133](https://github.com/icoretech/airbroke/issues/133)) ([5032204](https://github.com/icoretech/airbroke/commit/5032204f7d58119822bd12c233d34c29816680cc))
* **deps:** update dependency next-auth to v4.22.3 ([19c8961](https://github.com/icoretech/airbroke/commit/19c896102fa8ed216ed7891124674289982eefd3))
* **deps:** update dependency superjson to v1.13.1 ([#132](https://github.com/icoretech/airbroke/issues/132)) ([a823e8a](https://github.com/icoretech/airbroke/commit/a823e8a27bdeb5d96fd1b29da93e9f6abcad150a))

## [1.1.36](https://github.com/icoretech/airbroke/compare/v1.1.35...v1.1.36) (2023-07-15)


### Features

* **SparkLine.tsx:** add Sparkline component to render a line chart based on provided data, to be used later ([859fb84](https://github.com/icoretech/airbroke/commit/859fb8454c489f746269493c7e41db609398361a))


### Bug Fixes

* **airbrakeActions.ts:** change import statement for revalidatePath from 'next/cache' to 'next/cache' to fix import error ([71b819d](https://github.com/icoretech/airbroke/commit/71b819dc851200166c352c9ea611c02009f37fd5))
* **airbrakeActions.ts:** change revalidatePath calls to revalidateTag to fix deprecated method call and improve caching ([71b819d](https://github.com/icoretech/airbroke/commit/71b819dc851200166c352c9ea611c02009f37fd5))
* **deps:** update dependency @tailwindcss/forms to v0.5.4 ([0dfd302](https://github.com/icoretech/airbroke/commit/0dfd302fba7a43a7662f103722d2d49b8a94face))
* **deps:** update dependency ai to v2.1.18 ([#115](https://github.com/icoretech/airbroke/issues/115)) ([23af4ea](https://github.com/icoretech/airbroke/commit/23af4ea070d2ff3f1d0afb33d7857a900360efaa))
* **deps:** update dependency ai to v2.1.19 ([0ba5d9d](https://github.com/icoretech/airbroke/commit/0ba5d9d86829aac16aaa07bd3081c1bff9ffe170))
* **deps:** update dependency ai to v2.1.20 ([#123](https://github.com/icoretech/airbroke/issues/123)) ([6efd275](https://github.com/icoretech/airbroke/commit/6efd275746050c1eea0218816e9869acdc65a2e3))
* **deps:** update dependency postcss to v8.4.26 ([#124](https://github.com/icoretech/airbroke/issues/124)) ([60dfa5c](https://github.com/icoretech/airbroke/commit/60dfa5cebc98b991ad20e1d0a508d14a97c09c04))
* **deps:** update dependency sharp to v0.32.3 ([#111](https://github.com/icoretech/airbroke/issues/111)) ([6bb08df](https://github.com/icoretech/airbroke/commit/6bb08dfc24400ee4f5fc5b4f51afa63faf7c4b61))
* **deps:** update dependency tailwindcss to v3.3.3 ([#125](https://github.com/icoretech/airbroke/issues/125)) ([67569b0](https://github.com/icoretech/airbroke/commit/67569b0043f94238b37c9735fad62c97e01e531f))
* **Form.tsx:** change import statement for useRouter from 'next/navigation' to 'next/router' to fix import error ([71b819d](https://github.com/icoretech/airbroke/commit/71b819dc851200166c352c9ea611c02009f37fd5))
* **Form.tsx:** change import statement for useTransition from 'react' to 'react' to fix import error ([71b819d](https://github.com/icoretech/airbroke/commit/71b819dc851200166c352c9ea611c02009f37fd5))
* **OccurrenceChartWrapper.tsx:** update the `OccurrencesChartWrapper` components to generate a complete list of hourly intervals for the past 14 days and fill in the occurrence counts. If there were no occurrences for a certain hour, it now displays zero on the chart, rather than skipping that hour ([0b42ae2](https://github.com/icoretech/airbroke/commit/0b42ae21c34a383c6b8e77083657072330a324bd))
* **route.ts:** change the URL in the responseJSON to remove "/notices" from the URL ([e9f4ec6](https://github.com/icoretech/airbroke/commit/e9f4ec693306789afbde04dbec4eb35a33b862b2))

## [1.1.35](https://github.com/icoretech/airbroke/compare/v1.1.34...v1.1.35) (2023-07-09)


### Features

* **AI.tsx:** add buttons to toggle between regular and detailed completion requests ([d5f7968](https://github.com/icoretech/airbroke/commit/d5f7968a93c9548205a30c7849d97e5dfd0d745c))
* **AI.tsx:** add support for 'isDetailMode' state to determine whether to include extra data in the completion request, closes https://github.com/icoretech/airbroke/issues/74 ([d5f7968](https://github.com/icoretech/airbroke/commit/d5f7968a93c9548205a30c7849d97e5dfd0d745c))
* **completion/route.ts:** use vercel/ai instead of chatgpt, closes https://github.com/icoretech/airbroke/issues/101 ([b7c487b](https://github.com/icoretech/airbroke/commit/b7c487be68ffeae09e7d9d6eeb1d7d7a6465f288))
* **route.ts:** add support for 'sendExtraData' query parameter to include extra data in the prompt for error handling ([d5f7968](https://github.com/icoretech/airbroke/commit/d5f7968a93c9548205a30c7849d97e5dfd0d745c))
* **route.ts:** truncate the prompt to fit within the OpenAI token limit of 4096 tokens ([d5f7968](https://github.com/icoretech/airbroke/commit/d5f7968a93c9548205a30c7849d97e5dfd0d745c))
* **route.ts:** use configurable OpenAI engine from environment variable AIRBROKE_OPENAI_ENGINE ([a3a695f](https://github.com/icoretech/airbroke/commit/a3a695fa82a8f81a008bf5a9caf83375ec79ecbd))


### Bug Fixes

* **AI.tsx:** scroll textarea to bottom when completion or error changes ([a3a695f](https://github.com/icoretech/airbroke/commit/a3a695fa82a8f81a008bf5a9caf83375ec79ecbd))
* **route.ts:** remove unused code related to notice data ([a3a695f](https://github.com/icoretech/airbroke/commit/a3a695fa82a8f81a008bf5a9caf83375ec79ecbd))
* **route.ts:** simplify error response message when user is not logged in ([a3a695f](https://github.com/icoretech/airbroke/commit/a3a695fa82a8f81a008bf5a9caf83375ec79ecbd))

## [1.1.34](https://github.com/icoretech/airbroke/compare/v1.1.33...v1.1.34) (2023-07-09)


### Features

* switch to fork of react-icons ([64b8d49](https://github.com/icoretech/airbroke/commit/64b8d49a04c4e8965628f0b7caf0f806b8d3c645))


### Bug Fixes

* hide open sidebar button when not necessary ([64b8d49](https://github.com/icoretech/airbroke/commit/64b8d49a04c4e8965628f0b7caf0f806b8d3c645))

## [1.1.33](https://github.com/icoretech/airbroke/compare/v1.1.32...v1.1.33) (2023-07-09)


### Features

* **.drone.jsonnet:** add support for building and pushing Docker images only when on the main branch ([adf3d4a](https://github.com/icoretech/airbroke/commit/adf3d4ab6e910fc23866cbe99429a93526db3c63))
* **.drone.jsonnet:** add support for building Docker images without pushing when on any branch other than main ([adf3d4a](https://github.com/icoretech/airbroke/commit/adf3d4ab6e910fc23866cbe99429a93526db3c63))
* **.env.dist:** add AIRBROKE_CACHE environment variable to enable resource caching (experimental) ([9daf70b](https://github.com/icoretech/airbroke/commit/9daf70bb4a40b3e3e08ca6713895cf5b7067ddf9))
* **db.ts:** refactor prisma initialization ([a513e31](https://github.com/icoretech/airbroke/commit/a513e31921133efa5316be1bb02a6f8150063007))
* **db.ts:** update PrismaClient initialization to include query logging in development environment ([6e0c4d7](https://github.com/icoretech/airbroke/commit/6e0c4d7a87f12ad8904d80addaef74cb653d03aa))
* disable caching on individual pages, make use of our customCache ([2e17c20](https://github.com/icoretech/airbroke/commit/2e17c2090a2211cc995da70f4a7fd24bb449c430))
* **lib/cache.ts:** add customCache function to enable caching of function results ([9daf70b](https://github.com/icoretech/airbroke/commit/9daf70bb4a40b3e3e08ca6713895cf5b7067ddf9))
* **notices.ts:** add _fetchNoticeIdsByProjectId and _fetchNoticeEnvs helper functions to encapsulate database queries for fetching notice IDs and environments by project ID ([334dfee](https://github.com/icoretech/airbroke/commit/334dfeeb7f4b14980bba9c52816ab776251da756))
* **projects.ts:** add caching to the getProjectById function ([6e0c4d7](https://github.com/icoretech/airbroke/commit/6e0c4d7a87f12ad8904d80addaef74cb653d03aa))
* **projects.ts:** add caching to the getProjects function ([6e0c4d7](https://github.com/icoretech/airbroke/commit/6e0c4d7a87f12ad8904d80addaef74cb653d03aa))
* **projects.ts:** add caching to the getProjectsGroupedByOrganization function ([6e0c4d7](https://github.com/icoretech/airbroke/commit/6e0c4d7a87f12ad8904d80addaef74cb653d03aa))
* **queries/notices.ts:** add caching to fetchNotices and fetchNoticeById functions ([6e0c4d7](https://github.com/icoretech/airbroke/commit/6e0c4d7a87f12ad8904d80addaef74cb653d03aa))
* **queries/occurrenceBookmarks.ts:** add caching to fetchOccurrenceBookmarks function ([6e0c4d7](https://github.com/icoretech/airbroke/commit/6e0c4d7a87f12ad8904d80addaef74cb653d03aa))
* **queries/occurrences.ts:** add caching to fetchOccurrences function ([6e0c4d7](https://github.com/icoretech/airbroke/commit/6e0c4d7a87f12ad8904d80addaef74cb653d03aa))


### Bug Fixes

* **api/ai/route.ts:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **api/hc/route.ts:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **api/v3/notices/route.ts:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **auth.ts:** update import statement for prisma from "./db" to "@/lib/db" ([930dbc0](https://github.com/icoretech/airbroke/commit/930dbc06717edbd2c44effdedb514441050e698a))
* **components/OccurrenceChartWrapper.tsx:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **components/project/OccurrencesChartWrapper.tsx:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **db.ts:** update PrismaClient initialization to conditionally log queries and warnings based on NODE_ENV environment variable ([7bd6e6d](https://github.com/icoretech/airbroke/commit/7bd6e6dc31cd6d6d499200171dc8b377768d9f04))
* **deps:** update dependency postcss to v8.4.25 ([4dacb8d](https://github.com/icoretech/airbroke/commit/4dacb8d15314f617c816f8d67b4c640a8291d8f6))
* **deps:** update dependency prettier to v3 ([#98](https://github.com/icoretech/airbroke/issues/98)) ([7e31a4c](https://github.com/icoretech/airbroke/commit/7e31a4c9fa01c9cc3985289dae9e3fc522aecc79))
* **Form.tsx:** resolves warning: Cannot specify a "name" prop for a button that specifies a function as a formAction ([9711a11](https://github.com/icoretech/airbroke/commit/9711a1157891a2b740ab3399c7cef6d8b36d850a))
* **lib/actions/occurrenceActions.ts:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **lib/actions/projectActions.ts:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **lib/processError.ts:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **lib/queries/notices.ts:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **lib/queries/occurrenceBookmarks.ts:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **lib/queries/occurrences.ts:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **lib/queries/projects.ts:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **middleware.ts:** update the matcher regular expression to exclude the _vercel directory from being matched ([e8cbcaa](https://github.com/icoretech/airbroke/commit/e8cbcaab00355e11eccedc8179d52a6450a99cbb))
* **projects/page.tsx:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **testSetup.ts:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))

## [1.1.32](https://github.com/icoretech/airbroke/compare/v1.1.31...v1.1.32) (2023-06-26)


### Features

* **notices.ts:** add support for limiting the number of notices returned by getNotices function ([8d09776](https://github.com/icoretech/airbroke/commit/8d09776002d27459919d452ca581c272a7bffa5c))


### Bug Fixes

* **occurrences.ts:** unlimited data can crash prisma, default to 100 for now ([9d25777](https://github.com/icoretech/airbroke/commit/9d25777b8d20b4db4b289c0a45271c1fc7ddbae4))

## [1.1.31](https://github.com/icoretech/airbroke/compare/v1.1.30...v1.1.31) (2023-06-12)


### Features

* **package.json:** update next.js and related packages to stable version 13.4.5 ([ace107a](https://github.com/icoretech/airbroke/commit/ace107a3686021e1c86bcbbd0a614b9c4d798841))

## 1.1.30 (2023-06-08)


### Features

resolve buttons


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
