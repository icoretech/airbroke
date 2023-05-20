# Changelog

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
