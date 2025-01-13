# Changelog

## [1.1.72](https://github.com/icoretech/airbroke/compare/v1.1.71...v1.1.72) (2025-01-13)


### Bug Fixes

* **seed.ts:** add message hashing for occurrences to ensure hashed unique identifiers ([c5b14e4](https://github.com/icoretech/airbroke/commit/c5b14e462517588740fa62be887050de1af7f5c9))

## [1.1.71](https://github.com/icoretech/airbroke/compare/v1.1.70...v1.1.71) (2025-01-13)


### Features

* **ConfirmationDialog.tsx:** add refresh function from useRouter to update UI after delete action ([d96609b](https://github.com/icoretech/airbroke/commit/d96609b8e832711ef1b4f6c58e68e524ae92907c))
* **render.yaml:** add AIRBROKE_CORS_ORIGINS environment variable to configure CORS origins ([3f87524](https://github.com/icoretech/airbroke/commit/3f8752495805d504c8240c37967090f4c4e8e60b))


### Bug Fixes

* **deps:** update nextjs monorepo to v15.2.0-canary.6 ([#937](https://github.com/icoretech/airbroke/issues/937)) ([15d22e3](https://github.com/icoretech/airbroke/commit/15d22e3878e0ecb88dc5a2bb1c058be211e2ff04))
* **processError:** Use MD5 hash of error messages to uniquely identify occurrences, closes https://github.com/icoretech/airbroke/issues/6 ([296a121](https://github.com/icoretech/airbroke/commit/296a12173573ba2878afeb2f124ed7b58daf6148))

## [1.1.70](https://github.com/icoretech/airbroke/compare/v1.1.69...v1.1.70) (2025-01-12)


### Features

* **env:** add NEXT_SERVER_ACTIONS_ENCRYPTION_KEY to .env.dist for consistent encryption across servers ([a81061a](https://github.com/icoretech/airbroke/commit/a81061a92777c3c41255b64c69da5d4a69712ee3))
* **page.tsx:** add link to project name for easier navigation to project page ([3ecf79f](https://github.com/icoretech/airbroke/commit/3ecf79f0965ca6a032a8c25dd0cf3ce8ab6c2284))
* **signin:** add session check and redirect to projects if authenticated ([59aa1d7](https://github.com/icoretech/airbroke/commit/59aa1d77d38f35ad42a09437f68551cbe53926f4))


### Bug Fixes

* **SessionButtons.tsx:** update signOut import to use next-auth/react for consistency with authentication library usage ([c42b886](https://github.com/icoretech/airbroke/commit/c42b886c4197a05bac84fd2a3c0fb99aef7dc027))

## [1.1.69](https://github.com/icoretech/airbroke/compare/v1.1.68...v1.1.69) (2025-01-02)


### Bug Fixes

* **deps:** update dependency @ai-sdk/openai to v1.0.12 ([#918](https://github.com/icoretech/airbroke/issues/918)) ([6e99417](https://github.com/icoretech/airbroke/commit/6e994174278e0a3de5bfeac7db1fd2e6cfcd1432))
* **deps:** update dependency ai to v4.0.23 ([#919](https://github.com/icoretech/airbroke/issues/919)) ([ab4aa5a](https://github.com/icoretech/airbroke/commit/ab4aa5a135d888060942ebe37e732d8b1052376b))
* **deps:** update dependency react-chartjs-2 to v5.3.0 ([#917](https://github.com/icoretech/airbroke/issues/917)) ([51c5474](https://github.com/icoretech/airbroke/commit/51c5474522f6408501301554ed997e7d850d6620))
* **deps:** update dependency zod-form-data to v2.0.5 ([#907](https://github.com/icoretech/airbroke/issues/907)) ([43d2be7](https://github.com/icoretech/airbroke/commit/43d2be7e5a113a38ffe2d45dfae83a010d63917e))

## [1.1.68](https://github.com/icoretech/airbroke/compare/v1.1.67...v1.1.68) (2024-12-23)


### Bug Fixes

* **deps:** update @next/bundle-analyzer and eslint-config-next to latest versions for improved performance and bug fixes ([1f0d85d](https://github.com/icoretech/airbroke/commit/1f0d85d5a383a4edf1af97a74f1725dadc95f597))

## [1.1.67](https://github.com/icoretech/airbroke/compare/v1.1.66...v1.1.67) (2024-12-22)


### Bug Fixes

* **deps:** update dependency @ai-sdk/openai to v1.0.10 ([#878](https://github.com/icoretech/airbroke/issues/878)) ([d89c3f8](https://github.com/icoretech/airbroke/commit/d89c3f8e285f9d1e99bc2986b65524747a2149f6))
* **deps:** update dependency @ai-sdk/openai to v1.0.11 ([#910](https://github.com/icoretech/airbroke/issues/910)) ([8042297](https://github.com/icoretech/airbroke/commit/8042297f9c9fbcfc5387437b30659ffdc678fa2a))
* **deps:** update dependency ai to v4.0.20 ([#879](https://github.com/icoretech/airbroke/issues/879)) ([45ed5eb](https://github.com/icoretech/airbroke/commit/45ed5eb078d801c0e373724870662f5dfc9bf0af))
* **deps:** update dependency ai to v4.0.21 ([#909](https://github.com/icoretech/airbroke/issues/909)) ([f59e06b](https://github.com/icoretech/airbroke/commit/f59e06b3d311f30696e51d5f6c0f4df9b5619ecd))
* **deps:** update dependency ai to v4.0.22 ([#911](https://github.com/icoretech/airbroke/issues/911)) ([cd79aab](https://github.com/icoretech/airbroke/commit/cd79aab3acb4ce217eadf1dbc840b2571b02cfea))
* **deps:** update dependency chart.js to v4.4.7 ([#895](https://github.com/icoretech/airbroke/issues/895)) ([ec0a890](https://github.com/icoretech/airbroke/commit/ec0a890a25396f9ca47d926104ebaf0bd31c186d))
* **deps:** update dependency nanoid to v5.0.9 ([#892](https://github.com/icoretech/airbroke/issues/892)) ([54c55c6](https://github.com/icoretech/airbroke/commit/54c55c60b7c7577b9fbf649d7f8f1f78ecc83ae2))
* **deps:** update dependency postcss to v8.4.48 ([#874](https://github.com/icoretech/airbroke/issues/874)) ([b26a9f1](https://github.com/icoretech/airbroke/commit/b26a9f1407c06a039abfa226e61ae098fc0ace0b))
* **deps:** update dependency postcss to v8.4.49 ([#875](https://github.com/icoretech/airbroke/issues/875)) ([4dd9e44](https://github.com/icoretech/airbroke/commit/4dd9e44c535ce7ffe3324294b212bc7755b50790))
* **deps:** update dependency superjson to v2.2.2 ([#899](https://github.com/icoretech/airbroke/issues/899)) ([7a00ff7](https://github.com/icoretech/airbroke/commit/7a00ff7bcc946b5823ab087e48459aee42988df5))
* **deps:** update dependency tailwindcss to v3.4.15 ([#877](https://github.com/icoretech/airbroke/issues/877)) ([35d215d](https://github.com/icoretech/airbroke/commit/35d215d6d4fdd6020bbe4b9e9e8ee90b609920fa))
* **deps:** update dependency tailwindcss to v3.4.16 ([#896](https://github.com/icoretech/airbroke/issues/896)) ([045981c](https://github.com/icoretech/airbroke/commit/045981cc465b8205ed8ec12024a95fbc5e7989de))
* **deps:** update dependency tailwindcss to v3.4.17 ([#905](https://github.com/icoretech/airbroke/issues/905)) ([b3fa02a](https://github.com/icoretech/airbroke/commit/b3fa02a794416f6d88f64b75a11b32a9e01942ba))
* **deps:** update dependency typescript to v5.7.2 ([#884](https://github.com/icoretech/airbroke/issues/884)) ([30e892c](https://github.com/icoretech/airbroke/commit/30e892cc93a0258f681cf5e220556da600863dd7))
* **deps:** update dependency zod to v3.24.1 ([#902](https://github.com/icoretech/airbroke/issues/902)) ([a52ee62](https://github.com/icoretech/airbroke/commit/a52ee62ad3e72b6fab90312471d09d68848b29a5))
* **deps:** update prisma monorepo to v5.22.0 ([20a612c](https://github.com/icoretech/airbroke/commit/20a612c0e864ab560c08b1429c0d8cd3e6d8160d))
* **deps:** update prisma monorepo to v6.1.0 ([#906](https://github.com/icoretech/airbroke/issues/906)) ([211d717](https://github.com/icoretech/airbroke/commit/211d71762ef0e47f5dbbac246b07dd3919d9f484))

## [1.1.66](https://github.com/icoretech/airbroke/compare/v1.1.65...v1.1.66) (2024-11-05)


### Bug Fixes

* **deps:** update dependency @ai-sdk/openai to ^0.0.67 ([c1d3554](https://github.com/icoretech/airbroke/commit/c1d3554b392263a98025336c8e6afa7529583d41))
* **deps:** update dependency @ai-sdk/openai to ^0.0.68 ([ae2cfcb](https://github.com/icoretech/airbroke/commit/ae2cfcb7cf604865dda7f295d4f280a024cb82bb))
* **deps:** update dependency @ai-sdk/openai to ^0.0.70 ([aecd2b6](https://github.com/icoretech/airbroke/commit/aecd2b61f900751f4445987a4fe0bc20507e4ac5))
* **deps:** update dependency @ai-sdk/openai to ^0.0.71 ([8ef175f](https://github.com/icoretech/airbroke/commit/8ef175f8ae9632edd3bb9ff242480a8d92c5c0c1))
* **deps:** update dependency @ai-sdk/openai to ^0.0.72 ([19f26f7](https://github.com/icoretech/airbroke/commit/19f26f7d79cbbfc53f912d4d172dc984f83c9956))
* **deps:** update dependency @headlessui/react to v2.1.10 ([98d2d36](https://github.com/icoretech/airbroke/commit/98d2d36464e0cf27a04785d75bcd42de098179fd))
* **deps:** update dependency @headlessui/react to v2.2.0 ([036d3f9](https://github.com/icoretech/airbroke/commit/036d3f97c93a48e19b93bb83e11962b14cfa1389))
* **deps:** update dependency ai to v3.4.10 ([d33cf69](https://github.com/icoretech/airbroke/commit/d33cf691ed6834a26c3b3623414251ed6c90ed7f))
* **deps:** update dependency ai to v3.4.11 ([ee776ef](https://github.com/icoretech/airbroke/commit/ee776efd5af1974133f307c519bf2df0cd214161))
* **deps:** update dependency ai to v3.4.12 ([8bccb82](https://github.com/icoretech/airbroke/commit/8bccb8206201a7ce24fd9d5ca3deff5a4a37c375))
* **deps:** update dependency ai to v3.4.13 ([d03cb92](https://github.com/icoretech/airbroke/commit/d03cb922bf38642d3d1ec5de460292abf952873c))
* **deps:** update dependency ai to v3.4.16 ([18f53d4](https://github.com/icoretech/airbroke/commit/18f53d44be926beb403285d7fec38314b2496797))
* **deps:** update dependency ai to v3.4.17 ([7fbe69b](https://github.com/icoretech/airbroke/commit/7fbe69beb9fb6033add42d499da754aaa9e01744))
* **deps:** update dependency ai to v3.4.20 ([4f9ef55](https://github.com/icoretech/airbroke/commit/4f9ef5577443504231bcb78b0b15433fbfc2e37e))
* **deps:** update dependency ai to v3.4.21 ([be0de66](https://github.com/icoretech/airbroke/commit/be0de66dacaa1820940fc78ed4ac6659ffe950b8))
* **deps:** update dependency ai to v3.4.22 ([0a5d69d](https://github.com/icoretech/airbroke/commit/0a5d69d80487a7c883aa4ffc581450e3de237a1b))
* **deps:** update dependency ai to v3.4.23 ([4517e97](https://github.com/icoretech/airbroke/commit/4517e970bfddcfda704e340835dbba4472b0c081))
* **deps:** update dependency ai to v3.4.27 ([3223617](https://github.com/icoretech/airbroke/commit/32236178221016423b7ac271b203d28d067f936a))
* **deps:** update dependency ai to v3.4.29 ([11bb577](https://github.com/icoretech/airbroke/commit/11bb57779fad9aadb8a8ce4f401854c453414379))
* **deps:** update dependency ai to v3.4.30 ([e1e05b7](https://github.com/icoretech/airbroke/commit/e1e05b7783200044d9fbaba920dff9b087bfa895))
* **deps:** update dependency ai to v3.4.31 ([c67f420](https://github.com/icoretech/airbroke/commit/c67f420091931504bdbceb983a481bc2ebff6b16))
* **deps:** update dependency ai to v3.4.32 ([fc17f1f](https://github.com/icoretech/airbroke/commit/fc17f1f2448ea13479fd0b15ffee9f5c05a959b8))
* **deps:** update dependency ai to v3.4.33 ([bb731d8](https://github.com/icoretech/airbroke/commit/bb731d892697d1c3326e6ccde831d6e5dd5c892b))
* **deps:** update dependency chart.js to v4.4.5 ([55d1294](https://github.com/icoretech/airbroke/commit/55d129423280ff37529c302967da8bf100338418))
* **deps:** update dependency chart.js to v4.4.6 ([d9e9a86](https://github.com/icoretech/airbroke/commit/d9e9a865737f465e568e14f43a3e325062ace961))
* **deps:** update dependency nanoid to v5.0.8 ([f739b2d](https://github.com/icoretech/airbroke/commit/f739b2dd1942091c7c8e2a5c5317cecc80441a87))
* **deps:** update dependency tailwindcss to v3.4.14 ([1b1a365](https://github.com/icoretech/airbroke/commit/1b1a365665ab9ac6b372c5c70fd2d36b22c2cfac))
* **deps:** update dependency typescript to v5.6.3 ([320f4db](https://github.com/icoretech/airbroke/commit/320f4db652891069287a033bc7054debfe88636e))
* **deps:** update prisma monorepo to v5.21.0 ([f649ac4](https://github.com/icoretech/airbroke/commit/f649ac402e83a625329222c033868aa51404b451))
* **deps:** update prisma monorepo to v5.21.1 ([5ff842e](https://github.com/icoretech/airbroke/commit/5ff842ef023231bc75eb93a93dc11b99d06970a8))

## [1.1.65](https://github.com/icoretech/airbroke/compare/v1.1.64...v1.1.65) (2024-10-04)


### Bug Fixes

* **deps:** update dependency @ai-sdk/openai to ^0.0.63 ([eb8d392](https://github.com/icoretech/airbroke/commit/eb8d392097e7e9e8202bb17d727f306527560f4b))
* **deps:** update dependency @ai-sdk/openai to ^0.0.64 ([c2688e2](https://github.com/icoretech/airbroke/commit/c2688e2ef3ef5c4f5f31a316f5d6628640e28667))
* **deps:** update dependency @ai-sdk/openai to ^0.0.65 ([61d4984](https://github.com/icoretech/airbroke/commit/61d4984e5ad5b2fefbe81f569b22c0a4d91d8d3d))
* **deps:** update dependency @ai-sdk/openai to ^0.0.66 ([78a849b](https://github.com/icoretech/airbroke/commit/78a849b73fca2d91b69c7e99088227d618dc1bdc))
* **deps:** update dependency @headlessui/react to v2.1.9 ([4e319ac](https://github.com/icoretech/airbroke/commit/4e319accc7db972000e785aa0d16c9fed6df30d0))
* **deps:** update dependency ai to v3.4.7 ([b8467fd](https://github.com/icoretech/airbroke/commit/b8467fddfd0afc12e682980e5325604875774943))
* **deps:** update dependency ai to v3.4.8 ([20c0103](https://github.com/icoretech/airbroke/commit/20c010369a5f7c9712570b7368aa6a146a5e9f77))
* **deps:** update dependency ai to v3.4.9 ([d8e9f8c](https://github.com/icoretech/airbroke/commit/d8e9f8cdbde779c9a8cf28646424cf37f6d022eb))

## [1.1.64](https://github.com/icoretech/airbroke/compare/v1.1.63...v1.1.64) (2024-09-26)


### Bug Fixes

* **deps:** update dependency @ai-sdk/openai to ^0.0.61 ([dd9b127](https://github.com/icoretech/airbroke/commit/dd9b1276cf8252d8b2b29d81ec4013c0e3cbabbb))
* **deps:** update dependency @ai-sdk/openai to ^0.0.62 ([35df5ea](https://github.com/icoretech/airbroke/commit/35df5ea4c7265e5e5c3c34ea6318e6ef56a4694b))
* **deps:** update dependency ai to v3.3.41 ([1b6c649](https://github.com/icoretech/airbroke/commit/1b6c6497fc03f990d184c7c5a0b3ea51cc47da26))
* **deps:** update dependency ai to v3.3.43 ([0f13b44](https://github.com/icoretech/airbroke/commit/0f13b4446f1c4d4ab8acaec9971bdaa14b41becd))
* **deps:** update dependency ai to v3.3.44 ([67306b6](https://github.com/icoretech/airbroke/commit/67306b6990c042e75f99a66dac9c6f9664e0c876))
* **deps:** update dependency ai to v3.4.0 ([2f49509](https://github.com/icoretech/airbroke/commit/2f49509928a6ffde997202e59ef8c3ecf4526566))
* **deps:** update dependency ai to v3.4.1 ([3f03802](https://github.com/icoretech/airbroke/commit/3f03802042bbac62a7f2664d64284cf85116fc82))
* **deps:** update dependency ai to v3.4.2 ([87dc501](https://github.com/icoretech/airbroke/commit/87dc5011ebc4f0caece976e55f8c18731c22bd2d))
* **deps:** update dependency ai to v3.4.3 ([b41a8ee](https://github.com/icoretech/airbroke/commit/b41a8ee3a944763682c350db51dac1551a17a8e1))
* **deps:** update dependency ai to v3.4.4 ([e5de339](https://github.com/icoretech/airbroke/commit/e5de339a9b5e74226fc1408184ff1075963361a3))
* **deps:** update dependency tailwindcss to v3.4.12 ([9b755d7](https://github.com/icoretech/airbroke/commit/9b755d7455e913f7fd527061c0fa4fffdf3987c3))
* **deps:** update dependency tailwindcss to v3.4.13 ([7293ee6](https://github.com/icoretech/airbroke/commit/7293ee6fa9d43b9a0303e4e8473363d9b9803890))
* **deps:** update prisma monorepo to v5.20.0 ([62d5c8f](https://github.com/icoretech/airbroke/commit/62d5c8f44b0bef678e33bd6b7e421c1ceffdc6aa))

## [1.1.63](https://github.com/icoretech/airbroke/compare/v1.1.62...v1.1.63) (2024-09-17)


### Features

* **route.ts:** refactor OpenAI integration to use @ai-sdk/openai for improved functionality and maintainability ([41fc5d5](https://github.com/icoretech/airbroke/commit/41fc5d5fb25ec7b89e54e792c7b12c50b0ce9359))

## [1.1.62](https://github.com/icoretech/airbroke/compare/v1.1.61...v1.1.62) (2024-09-17)


### Bug Fixes

* **deps:** update dependency @headlessui/react to v2.1.3 ([04575a8](https://github.com/icoretech/airbroke/commit/04575a8c80f79ee05545c87e47475a3fb5f4d174))
* **deps:** update dependency @headlessui/react to v2.1.4 ([eb99dbf](https://github.com/icoretech/airbroke/commit/eb99dbf8dce3e5ef590198d19fdff524110cd4a2))
* **deps:** update dependency @headlessui/react to v2.1.5 ([ef190d2](https://github.com/icoretech/airbroke/commit/ef190d22959d211c6f547c6ceff81aaa888fbfc3))
* **deps:** update dependency @headlessui/react to v2.1.6 ([f2fa6f0](https://github.com/icoretech/airbroke/commit/f2fa6f05d7b1444969cfb7ecdd715f46cb227e9f))
* **deps:** update dependency @headlessui/react to v2.1.7 ([7cdb79c](https://github.com/icoretech/airbroke/commit/7cdb79cc9b815f279365b6833850712fc1dcfebb))
* **deps:** update dependency @headlessui/react to v2.1.8 ([a43ff57](https://github.com/icoretech/airbroke/commit/a43ff577fc586dc7c4d06a189f1bf8cc938356d0))
* **deps:** update dependency @tailwindcss/forms to v0.5.8 ([3d81a12](https://github.com/icoretech/airbroke/commit/3d81a121231b1f8c1ac5d54637060889bc4df58e))
* **deps:** update dependency @tailwindcss/forms to v0.5.9 ([62c8b80](https://github.com/icoretech/airbroke/commit/62c8b802d41ecad333f18e21fd67484d8fe201e2))
* **deps:** update dependency ai to v3.3.11 ([10413b2](https://github.com/icoretech/airbroke/commit/10413b2c10b13b353ca4213091222777e05ff9c1))
* **deps:** update dependency ai to v3.3.12 ([0df74a5](https://github.com/icoretech/airbroke/commit/0df74a5cda64726f2888eb0f5bf08113bbd1fd3e))
* **deps:** update dependency ai to v3.3.14 ([20d1c15](https://github.com/icoretech/airbroke/commit/20d1c157c623ecdf7a327ae9caf78ad0a940ea0b))
* **deps:** update dependency ai to v3.3.16 ([f153379](https://github.com/icoretech/airbroke/commit/f1533799d45fd5fdea1e4ccf58cb61d0e60de040))
* **deps:** update dependency ai to v3.3.17 ([a4b91fb](https://github.com/icoretech/airbroke/commit/a4b91fbb0cb4284977aeebbe50c96a88ced18ff4))
* **deps:** update dependency ai to v3.3.19 ([7612c4c](https://github.com/icoretech/airbroke/commit/7612c4c718a68e9e941228e99b2b769c7edcc738))
* **deps:** update dependency ai to v3.3.20 ([ab8b8d6](https://github.com/icoretech/airbroke/commit/ab8b8d642d5993f3ebb35cf1b6305655b649e535))
* **deps:** update dependency ai to v3.3.21 ([8aef0e6](https://github.com/icoretech/airbroke/commit/8aef0e66683fef321cae127c7531f9a585aa4146))
* **deps:** update dependency ai to v3.3.24 ([a59ce1c](https://github.com/icoretech/airbroke/commit/a59ce1c61250908cdea2a1d0113d2717d0dec19e))
* **deps:** update dependency ai to v3.3.25 ([b464b33](https://github.com/icoretech/airbroke/commit/b464b3357b76d3807e88132831efec8d212b44dd))
* **deps:** update dependency ai to v3.3.26 ([2f0e17a](https://github.com/icoretech/airbroke/commit/2f0e17a906ca4e35d5d4a733285250be92367462))
* **deps:** update dependency ai to v3.3.27 ([129d538](https://github.com/icoretech/airbroke/commit/129d53894934219ea295c10660e39e18ddeca820))
* **deps:** update dependency ai to v3.3.28 ([1c26626](https://github.com/icoretech/airbroke/commit/1c266260b3888615777c2fc928ab93d9ed82a505))
* **deps:** update dependency ai to v3.3.30 ([958df72](https://github.com/icoretech/airbroke/commit/958df727ba08b44ffe19da313d83645dcb7f3067))
* **deps:** update dependency ai to v3.3.31 ([87cbca1](https://github.com/icoretech/airbroke/commit/87cbca1360a8cc5ac3b8fe6501fbe93b1739d71a))
* **deps:** update dependency ai to v3.3.33 ([1b8f898](https://github.com/icoretech/airbroke/commit/1b8f8982f1402947c79276a6e363b0db742cec1d))
* **deps:** update dependency ai to v3.3.35 ([ca22220](https://github.com/icoretech/airbroke/commit/ca22220c304fb6150ab3c6cff82c12a137324964))
* **deps:** update dependency ai to v3.3.36 ([cc820e5](https://github.com/icoretech/airbroke/commit/cc820e5b07e87b37d37efa7ce4cb14de3b44f949))
* **deps:** update dependency ai to v3.3.37 ([31b9066](https://github.com/icoretech/airbroke/commit/31b9066e9417e7488d2e45cc650208b7174378d3))
* **deps:** update dependency ai to v3.3.39 ([89993e2](https://github.com/icoretech/airbroke/commit/89993e2bf4e1f97b3645078ebeaeee80f5564e02))
* **deps:** update dependency chart.js to v4.4.4 ([554b49e](https://github.com/icoretech/airbroke/commit/554b49e84ef4e20feaefdfc8faf473db6392b867))
* **deps:** update dependency openai to v4.56.1 ([177ead3](https://github.com/icoretech/airbroke/commit/177ead3cb0f9a23c363ff73f91658e9054a4c1f2))
* **deps:** update dependency openai to v4.57.0 ([fb8327a](https://github.com/icoretech/airbroke/commit/fb8327a680dfa4100f4c78d38ceeb16a1b4d527e))
* **deps:** update dependency openai to v4.57.1 ([a439340](https://github.com/icoretech/airbroke/commit/a439340324f74d8fcc973aadf788f94056fc80db))
* **deps:** update dependency openai to v4.57.3 ([c7b7612](https://github.com/icoretech/airbroke/commit/c7b7612d0a954bccce63dd085fd317b89a8b2cc2))
* **deps:** update dependency openai to v4.58.0 ([a161762](https://github.com/icoretech/airbroke/commit/a161762b9768e0e663d00d544e508330d4461321))
* **deps:** update dependency openai to v4.58.1 ([03a78c9](https://github.com/icoretech/airbroke/commit/03a78c9460bac43ced482dc01857f3786c2f9782))
* **deps:** update dependency openai to v4.58.2 ([8ea4be7](https://github.com/icoretech/airbroke/commit/8ea4be70b5298b4f597cf74d6e716106220fbca8))
* **deps:** update dependency openai to v4.59.0 ([f6b4003](https://github.com/icoretech/airbroke/commit/f6b4003ce55816bc68145c48d0e0e163fdfebb27))
* **deps:** update dependency openai to v4.60.0 ([e3b4d7f](https://github.com/icoretech/airbroke/commit/e3b4d7fa0eaddacee6b9f06932edff1bbb046704))
* **deps:** update dependency openai to v4.61.0 ([338c659](https://github.com/icoretech/airbroke/commit/338c65912a43edb69550fe31d7ba61e48c5b6c70))
* **deps:** update dependency openai to v4.61.1 ([c29e760](https://github.com/icoretech/airbroke/commit/c29e7606c78b0a9ef5e1e564ce8502e66b2d71b1))
* **deps:** update dependency postcss to v8.4.42 ([4d2c196](https://github.com/icoretech/airbroke/commit/4d2c196d1e0c9cf808b048e11fde065df1cf8f5d))
* **deps:** update dependency postcss to v8.4.44 ([4a0c987](https://github.com/icoretech/airbroke/commit/4a0c9877b68ec7894f768243ea40c67f3f37124f))
* **deps:** update dependency postcss to v8.4.45 ([edee710](https://github.com/icoretech/airbroke/commit/edee7108de53201bc4d82e007733a540e1e657d7))
* **deps:** update dependency postcss to v8.4.47 ([015c243](https://github.com/icoretech/airbroke/commit/015c2433727dd4c203fb07154b8b58e2655df1bf))
* **deps:** update dependency tailwindcss to v3.4.11 ([965ca8a](https://github.com/icoretech/airbroke/commit/965ca8afe4b399c74698eefd74ebe83aa89a2c3c))
* **deps:** update dependency typescript to v5.6.2 ([2c0a5a3](https://github.com/icoretech/airbroke/commit/2c0a5a31a88d816d3c61c81bf680b1e45a91847c))
* **deps:** update prisma monorepo to v5.19.0 ([b6e8eee](https://github.com/icoretech/airbroke/commit/b6e8eeed64dc414debb60b6aeadbbae8dde3e488))
* **deps:** update prisma monorepo to v5.19.1 ([20531c0](https://github.com/icoretech/airbroke/commit/20531c0580fa62c5c98052430dc3bf51125a250b))
* **queries:** Postgres: too many bind variables in prepared statement on findMany(), refs https://github.com/icoretech/airbroke/issues/771 ([72e17a1](https://github.com/icoretech/airbroke/commit/72e17a1aa089398efdf3498181d8fa7c77a6dafc))

## [1.1.61](https://github.com/icoretech/airbroke/compare/v1.1.60...v1.1.61) (2024-08-17)


### Features

* **ActionsMenu.tsx:** add MenuButton, MenuItem, MenuItems components for improved UI functionality ([5b5ed8e](https://github.com/icoretech/airbroke/commit/5b5ed8ee3393345b93e939f0bd248e480dfa4a50))
* **ConfirmationDialog.tsx:** add DialogPanel, DialogTitle, TransitionChild components from @headlessui/react for improved accessibility and functionality ([5b5ed8e](https://github.com/icoretech/airbroke/commit/5b5ed8ee3393345b93e939f0bd248e480dfa4a50))
* **Filter.tsx:** add MenuButton, MenuItem, MenuItems components from @headlessui/react for improved accessibility and functionality ([5b5ed8e](https://github.com/icoretech/airbroke/commit/5b5ed8ee3393345b93e939f0bd248e480dfa4a50))
* **package.json:** update "@headlessui/react" dependency to version 2.1.2 for compatibility and new features ([5b5ed8e](https://github.com/icoretech/airbroke/commit/5b5ed8ee3393345b93e939f0bd248e480dfa4a50))
* **SidebarMobile.tsx:** add DialogPanel, TransitionChild components from @headlessui/react for improved accessibility and functionality ([5b5ed8e](https://github.com/icoretech/airbroke/commit/5b5ed8ee3393345b93e939f0bd248e480dfa4a50))
* **Sort.tsx:** add MenuButton, MenuItem, MenuItems components from @headlessui/react for improved accessibility and functionality ([5b5ed8e](https://github.com/icoretech/airbroke/commit/5b5ed8ee3393345b93e939f0bd248e480dfa4a50))
* **ToggleIntake.tsx:** add Field, Label components for improved UI functionality ([5b5ed8e](https://github.com/icoretech/airbroke/commit/5b5ed8ee3393345b93e939f0bd248e480dfa4a50))


### Bug Fixes

* **package.json:** update eslint and eslint-config-next to versions 8.57.0 and 14.2.5 respectively to stay up to date with latest changes and improvements ([5714315](https://github.com/icoretech/airbroke/commit/57143157f5bb1ec6df0f5f10d4e2c3b9568f355c))
* **package.json:** update next and next/bundle-analyzer dependencies to versions 14.2.5 to fix known issues and ensure compatibility ([5714315](https://github.com/icoretech/airbroke/commit/57143157f5bb1ec6df0f5f10d4e2c3b9568f355c))
* **package.json:** update version of "@testing-library/react" to "16.0.0" to match the required version for compatibility with other dependencies ([cb7a2c0](https://github.com/icoretech/airbroke/commit/cb7a2c0db0ef394392edb7a7ecf6b6262ddbc1ed))

## [1.1.60](https://github.com/icoretech/airbroke/compare/v1.1.59...v1.1.60) (2024-08-17)


### Bug Fixes

* **.env.dist:** update AIRBROKE_OPENAI_ENGINE value to 'gpt-4o' for consistency ([8a76fee](https://github.com/icoretech/airbroke/commit/8a76fee2757af36a3655626b04b497fa2c17432c))
* **route.ts:** update default model value to 'gpt-4o' to match the .env configuration and ensure consistency ([8a76fee](https://github.com/icoretech/airbroke/commit/8a76fee2757af36a3655626b04b497fa2c17432c))

## [1.1.59](https://github.com/icoretech/airbroke/compare/v1.1.58...v1.1.59) (2024-08-17)


### Features

* **.env.dist:** update AIRBROKE_OPENAI_ENGINE to 'gpt-4o-latest' for the latest OpenAI engine version ([f1b22ad](https://github.com/icoretech/airbroke/commit/f1b22adb980bd728f6abad091f26b23b192d1012))
* **package.json:** update ai package version to 3.3.9, openai package version to ^4.56.0, @types/node package version to 22.4.0, and npm-check-updates package version to ^17.0.6 ([f1b22ad](https://github.com/icoretech/airbroke/commit/f1b22adb980bd728f6abad091f26b23b192d1012))


### Bug Fixes

* **app/api/completion/route.ts:** update default model to 'gpt-4o-latest' in case AIRBROKE_OPENAI_ENGINE is not set ([f1b22ad](https://github.com/icoretech/airbroke/commit/f1b22adb980bd728f6abad091f26b23b192d1012))
* **deps:** update dependency ai to v3.3.5 ([a03da3d](https://github.com/icoretech/airbroke/commit/a03da3db81ebb51832fbdff63a64cbf28d7a4803))
* **deps:** update dependency ai to v3.3.6 ([ba8049d](https://github.com/icoretech/airbroke/commit/ba8049d05416ba4f4610303b959d895c817eacab))
* **deps:** update dependency openai to v4.55.4 ([e75108e](https://github.com/icoretech/airbroke/commit/e75108e98abb0276da8920a6b3facedcaf7b9dd7))
* **deps:** update dependency openai to v4.55.5 ([d3f8549](https://github.com/icoretech/airbroke/commit/d3f85496b37996cc17513dfce6c0094ec1d7014d))
* **generate-release.yml:** update release-please-action dependency to googleapis to fix broken workflow step ([994575d](https://github.com/icoretech/airbroke/commit/994575d5f48ec5bbc362c3419d0f7e8627566f05))
* **package.json:** update sharp package to version 0.33.5 for bug fixes ([48d3ba4](https://github.com/icoretech/airbroke/commit/48d3ba4a028035810dda94b6b486bdccf6f099ec))
* **package.json:** update tailwindcss package to version 3.4.10 for the latest features and improvements ([48d3ba4](https://github.com/icoretech/airbroke/commit/48d3ba4a028035810dda94b6b486bdccf6f099ec))

## [1.1.58](https://github.com/icoretech/airbroke/compare/v1.1.57...v1.1.58) (2024-08-09)


### Bug Fixes

* **deps:** update dependency ai to v3.2.36 ([7fd4757](https://github.com/icoretech/airbroke/commit/7fd4757722a1931bd831e431b1cb89bc39961680))
* **deps:** update dependency ai to v3.2.37 ([f642cc9](https://github.com/icoretech/airbroke/commit/f642cc975926a63b79a6e529e6173717959c2375))
* **deps:** update dependency ai to v3.2.38 ([8a9700d](https://github.com/icoretech/airbroke/commit/8a9700d1ffc54a5cc62b53d220561c448b5edf19))
* **deps:** update dependency ai to v3.2.40 ([454346a](https://github.com/icoretech/airbroke/commit/454346a341f0052cfbdd4df357123e5f6a886434))
* **deps:** update dependency ai to v3.2.41 ([94e3781](https://github.com/icoretech/airbroke/commit/94e3781bb7782a160e26d5fcd7ec3de91dad82c9))
* **deps:** update dependency ai to v3.2.45 ([f196fba](https://github.com/icoretech/airbroke/commit/f196fba3fba6ad6ef8bd12c54e71c66449dda8d5))
* **deps:** update dependency ai to v3.3.0 ([2a8b716](https://github.com/icoretech/airbroke/commit/2a8b716b290fba72d038873a6c9b889db7ad8c54))
* **deps:** update dependency ai to v3.3.2 ([b386c39](https://github.com/icoretech/airbroke/commit/b386c392b1cbffbeb4554912846414081e8178c1))
* **deps:** update dependency ai to v3.3.3 ([#682](https://github.com/icoretech/airbroke/issues/682)) ([bc3f42f](https://github.com/icoretech/airbroke/commit/bc3f42f9bf40998073a9845a9c235b5fcd40fd8c))
* **deps:** update dependency ai to v3.3.4 ([8b17213](https://github.com/icoretech/airbroke/commit/8b1721398a16dbb70639a9cbcf9587d5d149fbac))
* **deps:** update dependency autoprefixer to v10.4.20 ([93bc308](https://github.com/icoretech/airbroke/commit/93bc308a384d9891f0a0938ab28c597ecc5a8c2e))
* **deps:** update dependency openai to v4.53.1 ([8d69da3](https://github.com/icoretech/airbroke/commit/8d69da340c9cd5089f74350f90de0355cdd43b61))
* **deps:** update dependency openai to v4.53.2 ([ed44e5e](https://github.com/icoretech/airbroke/commit/ed44e5e2a6577331393ffa7ba4a6fbd66da6ad6d))
* **deps:** update dependency openai to v4.54.0 ([6db0cc9](https://github.com/icoretech/airbroke/commit/6db0cc95b4739d5ef81946b7101a0006d255ea14))
* **deps:** update dependency openai to v4.55.0 ([e9962c5](https://github.com/icoretech/airbroke/commit/e9962c5a15940d26b5fdcb848d249eedf37ccf19))
* **deps:** update dependency openai to v4.55.1 ([f2952bc](https://github.com/icoretech/airbroke/commit/f2952bc4693c34a136e03b62dc6ca84ce51d3169))
* **deps:** update dependency openai to v4.55.3 ([#687](https://github.com/icoretech/airbroke/issues/687)) ([678a1c1](https://github.com/icoretech/airbroke/commit/678a1c1cdd8e80cca7fc9fe78238d152e276848e))
* **deps:** update dependency postcss to v8.4.41 ([38bfa55](https://github.com/icoretech/airbroke/commit/38bfa554c7c1681ee816470f6261b3bef68ec4b2))
* **deps:** update dependency tailwindcss to v3.4.7 ([a086dd4](https://github.com/icoretech/airbroke/commit/a086dd4740a2377e7724b39f08dfc64cc12ad473))
* **deps:** update dependency tailwindcss to v3.4.9 ([17b571e](https://github.com/icoretech/airbroke/commit/17b571ef83c80f943bb6ad8fc0a80279edc0ecd5))
* **deps:** update prisma monorepo to v5.18.0 ([4e43599](https://github.com/icoretech/airbroke/commit/4e435993d0e38a8ed6463faa46c6717421ceb299))

## [1.1.57](https://github.com/icoretech/airbroke/compare/v1.1.56...v1.1.57) (2024-07-25)


### Bug Fixes

* **deps:** update dependency ai to v3.1.13 ([8b0bd66](https://github.com/icoretech/airbroke/commit/8b0bd66d26a8f3212c059fa8b77f303747aa8a4f))
* **deps:** update dependency ai to v3.1.14 ([2738e26](https://github.com/icoretech/airbroke/commit/2738e26883d7065829f22fba40c9f58cba109bcf))
* **deps:** update dependency ai to v3.1.15 ([dc3055e](https://github.com/icoretech/airbroke/commit/dc3055e02e0203001a4d448518836309892c49f2))
* **deps:** update dependency ai to v3.1.16 ([f09e833](https://github.com/icoretech/airbroke/commit/f09e833879d3368901b24a42c15126c600799b1f))
* **deps:** update dependency ai to v3.1.17 ([f456e9a](https://github.com/icoretech/airbroke/commit/f456e9af2965e8d3830d6d501c3602cd2f376c54))
* **deps:** update dependency ai to v3.1.18 ([9722d81](https://github.com/icoretech/airbroke/commit/9722d81864a16848cf81e1e737ee58dfb6ccfc7c))
* **deps:** update dependency ai to v3.1.19 ([86bc3bc](https://github.com/icoretech/airbroke/commit/86bc3bc1836f4676601f21e6148d8e80d7666111))
* **deps:** update dependency ai to v3.1.21 ([6b3ccb0](https://github.com/icoretech/airbroke/commit/6b3ccb00f44f1655f379173ca82f1534a614168f))
* **deps:** update dependency ai to v3.1.22 ([1152f99](https://github.com/icoretech/airbroke/commit/1152f996f79ed34fbf30a3cb26c7e5cfd290a95e))
* **deps:** update dependency ai to v3.1.23 ([97e4742](https://github.com/icoretech/airbroke/commit/97e47422793e9b8b95601e43ac9b259f06fc815e))
* **deps:** update dependency ai to v3.1.26 ([ceb5ad7](https://github.com/icoretech/airbroke/commit/ceb5ad7a82552a7e88a0896b4a1ceaf4d5aa3415))
* **deps:** update dependency ai to v3.1.27 ([642c2e4](https://github.com/icoretech/airbroke/commit/642c2e41e77f3eab297bdb1a9698c7ea2b602736))
* **deps:** update dependency ai to v3.1.28 ([2e3a82e](https://github.com/icoretech/airbroke/commit/2e3a82e5f6f6d593bd93cc3a263e884838d9d9bd))
* **deps:** update dependency ai to v3.1.30 ([5ea64cf](https://github.com/icoretech/airbroke/commit/5ea64cfa45803dc415018b35d27350f41c59905c))
* **deps:** update dependency ai to v3.1.31 ([7370f72](https://github.com/icoretech/airbroke/commit/7370f725426383b2a324644ee83422b953b3514f))
* **deps:** update dependency ai to v3.1.32 ([beaa87d](https://github.com/icoretech/airbroke/commit/beaa87dad29ef9bd1060b7a1c91282cb0a0e3e34))
* **deps:** update dependency ai to v3.1.33 ([c34aecd](https://github.com/icoretech/airbroke/commit/c34aecde1c3baed993e6bd55f23ed98cb583ec00))
* **deps:** update dependency ai to v3.1.35 ([fab9825](https://github.com/icoretech/airbroke/commit/fab982583d1d64c4865ac7bfb7752ebe7f156f2d))
* **deps:** update dependency ai to v3.1.36 ([5f67177](https://github.com/icoretech/airbroke/commit/5f67177eb5c9b273b63e14028b33fbec0146d6d9))
* **deps:** update dependency ai to v3.1.37 ([dae5453](https://github.com/icoretech/airbroke/commit/dae5453bc89f68bf983a09cf53ae8cb74c9d66d5))
* **deps:** update dependency ai to v3.2.0 ([9444e62](https://github.com/icoretech/airbroke/commit/9444e62ce56a0521d4f1d26f2a75cf7537075383))
* **deps:** update dependency ai to v3.2.1 ([199ce65](https://github.com/icoretech/airbroke/commit/199ce653d37b82fca491c7228a0fe22dc091d802))
* **deps:** update dependency ai to v3.2.10 ([215495e](https://github.com/icoretech/airbroke/commit/215495e7fd15cf1db981baa7c86058ae82f73ebb))
* **deps:** update dependency ai to v3.2.11 ([f0f0f76](https://github.com/icoretech/airbroke/commit/f0f0f76becd4733ff39c0929740b5411dea697c2))
* **deps:** update dependency ai to v3.2.14 ([cd58492](https://github.com/icoretech/airbroke/commit/cd58492340fd820dcd0e488378ba03bcccdbf1f1))
* **deps:** update dependency ai to v3.2.15 ([3f3e809](https://github.com/icoretech/airbroke/commit/3f3e8097755e64be16e378b5a0ada3a171ba74ab))
* **deps:** update dependency ai to v3.2.16 ([0fadd24](https://github.com/icoretech/airbroke/commit/0fadd247f5f4532337e40571e590d65a4ecbead7))
* **deps:** update dependency ai to v3.2.17 ([8f7cd3a](https://github.com/icoretech/airbroke/commit/8f7cd3a3487668adb62e1d734cd7d9516e454118))
* **deps:** update dependency ai to v3.2.18 ([b9ee76c](https://github.com/icoretech/airbroke/commit/b9ee76c6f38fb04b0622307c488829e73d49f4a4))
* **deps:** update dependency ai to v3.2.19 ([f8067ff](https://github.com/icoretech/airbroke/commit/f8067ffe45109d57d52de9e9816425f25195b102))
* **deps:** update dependency ai to v3.2.20 ([f4a5601](https://github.com/icoretech/airbroke/commit/f4a5601a71393f8a8f2621b8e4a95987e003adc7))
* **deps:** update dependency ai to v3.2.22 ([3082e43](https://github.com/icoretech/airbroke/commit/3082e43d5777cd1a5356ee36e0741b4f7ab813e9))
* **deps:** update dependency ai to v3.2.23 ([5770926](https://github.com/icoretech/airbroke/commit/57709269d3e3b78bfb26debe113efc594e828612))
* **deps:** update dependency ai to v3.2.24 ([3c3d6fd](https://github.com/icoretech/airbroke/commit/3c3d6fd814bed3e5a99b3f272d588f4100bcc82b))
* **deps:** update dependency ai to v3.2.27 ([#642](https://github.com/icoretech/airbroke/issues/642)) ([e02dffb](https://github.com/icoretech/airbroke/commit/e02dffb7295956276bc1a9f64beddbc4c6946c6f))
* **deps:** update dependency ai to v3.2.30 ([dee1471](https://github.com/icoretech/airbroke/commit/dee14714f1c25012add3feeb2ce10eed8730f340))
* **deps:** update dependency ai to v3.2.32 ([7bd0407](https://github.com/icoretech/airbroke/commit/7bd04076a5ce43acb7cc8c0e9b5479559f0ec363))
* **deps:** update dependency ai to v3.2.33 ([cec3955](https://github.com/icoretech/airbroke/commit/cec39559471aad0b83fffa58bbeb7adeb232a51a))
* **deps:** update dependency ai to v3.2.34 ([cffc028](https://github.com/icoretech/airbroke/commit/cffc028e2dd0375d1661a3592b477749be2cdfa8))
* **deps:** update dependency ai to v3.2.35 ([e63fe64](https://github.com/icoretech/airbroke/commit/e63fe64bdd9d99f237b1d2eaa3ae467263ab311c))
* **deps:** update dependency ai to v3.2.5 ([5eeafac](https://github.com/icoretech/airbroke/commit/5eeafaced03ba57cf17da7f694d53857fad72b08))
* **deps:** update dependency ai to v3.2.7 ([1716155](https://github.com/icoretech/airbroke/commit/17161557dd84a1ba63325a236422afaaaf5de073))
* **deps:** update dependency ai to v3.2.8 ([d667fec](https://github.com/icoretech/airbroke/commit/d667fecd6f14900916b5674dc788cc44eb97dc8c))
* **deps:** update dependency ai to v3.2.9 ([e195230](https://github.com/icoretech/airbroke/commit/e195230bc01df560e0068eb6ba2ff517c49bdf6d))
* **deps:** update dependency chance to v1.1.12 ([e891d82](https://github.com/icoretech/airbroke/commit/e891d8291427c0952657c51aef87b1b15cb291a9))
* **deps:** update dependency openai to v4.47.2 ([33e0976](https://github.com/icoretech/airbroke/commit/33e09769f87d35220604517708570bf6118f8a65))
* **deps:** update dependency openai to v4.47.3 ([5082acd](https://github.com/icoretech/airbroke/commit/5082acd03389fc095b027d093f9156c5890b9685))
* **deps:** update dependency openai to v4.48.1 ([84e0759](https://github.com/icoretech/airbroke/commit/84e0759b3401062372a5b2a2c8778d220eca81bd))
* **deps:** update dependency openai to v4.48.2 ([8858b71](https://github.com/icoretech/airbroke/commit/8858b711f322ba099345341cf0cba8db62ca9afc))
* **deps:** update dependency openai to v4.48.3 ([02c46f2](https://github.com/icoretech/airbroke/commit/02c46f2fb6d8634fcce1b60afb068d0375e399e9))
* **deps:** update dependency openai to v4.49.0 ([987e6bb](https://github.com/icoretech/airbroke/commit/987e6bb69d9bd79522c12137d32823e6e17e8434))
* **deps:** update dependency openai to v4.49.1 ([621e64d](https://github.com/icoretech/airbroke/commit/621e64d40ed9140090da74a1be46a5cc6ca05c38))
* **deps:** update dependency openai to v4.50.0 ([148cdfa](https://github.com/icoretech/airbroke/commit/148cdfa62b39e30987478b967e6f1cf37e35f20e))
* **deps:** update dependency openai to v4.51.0 ([edad545](https://github.com/icoretech/airbroke/commit/edad5458ecdd61a96d6e3909464ed9483ee5decd))
* **deps:** update dependency openai to v4.52.0 ([e18ca21](https://github.com/icoretech/airbroke/commit/e18ca21b908c1ff4bd1030ae15be162355275bc2))
* **deps:** update dependency openai to v4.52.1 ([e09481c](https://github.com/icoretech/airbroke/commit/e09481c80414c5bdf7cef637bd9a25f9bd537d5b))
* **deps:** update dependency openai to v4.52.2 ([c81372b](https://github.com/icoretech/airbroke/commit/c81372be244a2a16f82cd21cc4a3157663f9d4e2))
* **deps:** update dependency openai to v4.52.3 ([3c84432](https://github.com/icoretech/airbroke/commit/3c844320e4cc84ee5c8d626006233b9898a9e2dc))
* **deps:** update dependency openai to v4.52.4 ([196d0d1](https://github.com/icoretech/airbroke/commit/196d0d1cc4d29ff480026cb6780473aaebde6dad))
* **deps:** update dependency openai to v4.52.5 ([fe9fac8](https://github.com/icoretech/airbroke/commit/fe9fac8653b73cdced472ce1c4ef2a1a82c810b5))
* **deps:** update dependency openai to v4.52.7 ([c4452ad](https://github.com/icoretech/airbroke/commit/c4452ad9c08497712a3b9eb5784025213a416d95))
* **deps:** update dependency openai to v4.53.0 ([c7e9713](https://github.com/icoretech/airbroke/commit/c7e971383a4ca7752f6c96e4f6da642495c964ce))
* **deps:** update dependency postcss to v8.4.39 ([99a19c5](https://github.com/icoretech/airbroke/commit/99a19c5efc22a5d2892ac63972d09649e7d1b68b))
* **deps:** update dependency postcss to v8.4.40 ([a37139d](https://github.com/icoretech/airbroke/commit/a37139d6ce2ae9be94fba38e5279d55de9e2db50))
* **deps:** update dependency tailwindcss to v3.4.4 ([d725325](https://github.com/icoretech/airbroke/commit/d72532530f4147a03498b3ceb4ba9df229a50545))
* **deps:** update dependency tailwindcss to v3.4.5 ([8ca0217](https://github.com/icoretech/airbroke/commit/8ca0217346a94bf132aaacdbc9c1282db68e2eda))
* **deps:** update dependency tailwindcss to v3.4.6 ([8e345ef](https://github.com/icoretech/airbroke/commit/8e345efe0ad4217fd9e30834da161fef8640f97a))
* **deps:** update dependency typescript to v5.5.2 ([dfcbe5e](https://github.com/icoretech/airbroke/commit/dfcbe5e6db249b65694273a525703b6be984d0fa))
* **deps:** update dependency typescript to v5.5.3 ([cb5d373](https://github.com/icoretech/airbroke/commit/cb5d373f533ef1f6aef7c0fad7d9966583560952))
* **deps:** update dependency typescript to v5.5.4 ([bd6ff82](https://github.com/icoretech/airbroke/commit/bd6ff82bc69e389f08d95c18373e73f20b03f946))
* **deps:** update prisma monorepo to v5.15.0 ([28b2c17](https://github.com/icoretech/airbroke/commit/28b2c177093774b5f4260eb2f98be1478e67f1c1))
* **deps:** update prisma monorepo to v5.15.1 ([5540e29](https://github.com/icoretech/airbroke/commit/5540e2950be4ddda8b40563698b5b646910b5f45))
* **deps:** update prisma monorepo to v5.16.0 ([f64ef04](https://github.com/icoretech/airbroke/commit/f64ef04930b68131c94d847959528dfd993198b2))
* **deps:** update prisma monorepo to v5.16.1 ([f19059b](https://github.com/icoretech/airbroke/commit/f19059bd7d56752cf1f87aea7c55bfe52668296a))
* **deps:** update prisma monorepo to v5.16.2 ([662a4a0](https://github.com/icoretech/airbroke/commit/662a4a0a9b53feaa16596293e372bfbe13e3a3c3))
* **deps:** update prisma monorepo to v5.17.0 ([9637e71](https://github.com/icoretech/airbroke/commit/9637e7148adcced1beee7b452abe77538f653cfa))

## [1.1.56](https://github.com/icoretech/airbroke/compare/v1.1.55...v1.1.56) (2024-05-18)


### Bug Fixes

* **deps:** update dependency ai to v3.1.0 ([#437](https://github.com/icoretech/airbroke/issues/437)) ([7f6edd7](https://github.com/icoretech/airbroke/commit/7f6edd772a6359047ad34a78bfdef9db960d8f5e))
* **deps:** update dependency ai to v3.1.1 ([b6d6dc5](https://github.com/icoretech/airbroke/commit/b6d6dc5a101f9b93f0f9c3e747dc8dd5edc0523a))
* **deps:** update dependency ai to v3.1.11 ([76d8e24](https://github.com/icoretech/airbroke/commit/76d8e245ab16cc3e65900cd253b798df9fa8ae5b))
* **deps:** update dependency ai to v3.1.12 ([2fdeb45](https://github.com/icoretech/airbroke/commit/2fdeb450ce0ee90045e1de9eed6faac222aadc53))
* **deps:** update dependency ai to v3.1.2 ([da1b049](https://github.com/icoretech/airbroke/commit/da1b04961f5f7ee4454809682e6b3d3f37e0b59f))
* **deps:** update dependency ai to v3.1.3 ([55a9bc0](https://github.com/icoretech/airbroke/commit/55a9bc0a2e770a986db7e8be3129fc78e4ae2dba))
* **deps:** update dependency ai to v3.1.4 ([d67fc38](https://github.com/icoretech/airbroke/commit/d67fc3838d1ce54491cca637268a4cebcd22491a))
* **deps:** update dependency ai to v3.1.5 ([0db4252](https://github.com/icoretech/airbroke/commit/0db42521e31ae2a4f692df3b9fc4b6785b9293b3))
* **deps:** update dependency ai to v3.1.7 ([75300d5](https://github.com/icoretech/airbroke/commit/75300d591468f1bb22b482b561f8da2e847a33a8))
* **deps:** update dependency ai to v3.1.8 ([f79b598](https://github.com/icoretech/airbroke/commit/f79b59836d64a53771865f310cf896139d398145))
* **deps:** update dependency ai to v3.1.9 ([72652d2](https://github.com/icoretech/airbroke/commit/72652d27ad2718cf4b5bfdccb448e1d3c3b0d7b1))
* **deps:** update dependency chart.js to v4.4.3 ([36e4e0b](https://github.com/icoretech/airbroke/commit/36e4e0b87d39463c6719d47ecdfdee42f921349d))
* **deps:** update dependency octokit to v3.2.1 ([805516b](https://github.com/icoretech/airbroke/commit/805516b7a3bea5fc1daeac90bd9ba2534ecf67a9))
* **deps:** update dependency openai to v4.39.1 ([#480](https://github.com/icoretech/airbroke/issues/480)) ([5df998b](https://github.com/icoretech/airbroke/commit/5df998bc833398e0457309d7c57f4be0ecd8f076))
* **deps:** update dependency openai to v4.40.0 ([77e371e](https://github.com/icoretech/airbroke/commit/77e371e889d631c63140202dd1653f9e6b094a6d))
* **deps:** update dependency openai to v4.40.1 ([6c94c09](https://github.com/icoretech/airbroke/commit/6c94c0933894f907e3e59b7f0ba58e19e7d57820))
* **deps:** update dependency openai to v4.40.2 ([719833a](https://github.com/icoretech/airbroke/commit/719833a3f1b8ec132739f9ab99565a9c76937b68))
* **deps:** update dependency openai to v4.41.0 ([b6cf30f](https://github.com/icoretech/airbroke/commit/b6cf30f839caded6a8916fa72f70706b0de0d14b))
* **deps:** update dependency openai to v4.41.1 ([21af035](https://github.com/icoretech/airbroke/commit/21af035ce00050ada7e9806a6cbce41a658c5cd7))
* **deps:** update dependency openai to v4.42.0 ([d40fb5b](https://github.com/icoretech/airbroke/commit/d40fb5b74b8b5853f2da67b366c56f3e19262e79))
* **deps:** update dependency openai to v4.43.0 ([e9c6a16](https://github.com/icoretech/airbroke/commit/e9c6a16000488104857c102e6e9f872d48b7b7fc))
* **deps:** update dependency openai to v4.44.0 ([0d258b6](https://github.com/icoretech/airbroke/commit/0d258b6c21bcc697f4a9d5c19f3b701380cdd1ce))
* **deps:** update dependency openai to v4.45.0 ([85679a8](https://github.com/icoretech/airbroke/commit/85679a893b64e557f0b28e8ae275d569673fc33b))
* **deps:** update dependency openai to v4.46.1 ([616bf82](https://github.com/icoretech/airbroke/commit/616bf820ac9bea1ac2f582a729a9d6e79f2c0650))
* **deps:** update dependency openai to v4.47.0 ([686cae9](https://github.com/icoretech/airbroke/commit/686cae97061a626fb245894c24ba038338c6d67a))
* **deps:** update dependency sharp to v0.33.4 ([6e214bb](https://github.com/icoretech/airbroke/commit/6e214bbfe4b9ae0640d0afa37ea6320a7076a7fb))
* **deps:** update prisma monorepo to v5.14.0 ([02c4892](https://github.com/icoretech/airbroke/commit/02c48928b4afd4bff9fb7d7160a1b1d846608321))

## [1.1.55](https://github.com/icoretech/airbroke/compare/v1.1.54...v1.1.55) (2024-04-30)


### Features

* **release-please-config.json:** add release-please configuration for airbroke package with node release type and always-bump-patch versioning ([61798d0](https://github.com/icoretech/airbroke/commit/61798d0933852a7d06a8353cb528544077a7cb01))
* **release-please-config.json:** set release-type field to "node" to specify the type of release being performed ([dd98ee2](https://github.com/icoretech/airbroke/commit/dd98ee23f5815d550e1122012621565cc004851a))

## [1.2.0](https://github.com/icoretech/airbroke/compare/airbroke-v1.1.54...airbroke-v1.2.0) (2024-04-30)


### Features

* **.drone.jsonnet:** add support for building and pushing Docker images only when on the main branch ([adf3d4a](https://github.com/icoretech/airbroke/commit/adf3d4ab6e910fc23866cbe99429a93526db3c63))
* **.drone.jsonnet:** add support for building Docker images without pushing when on any branch other than main ([adf3d4a](https://github.com/icoretech/airbroke/commit/adf3d4ab6e910fc23866cbe99429a93526db3c63))
* **.env.dist:** add AIRBROKE_CACHE environment variable to enable resource caching (experimental) ([9daf70b](https://github.com/icoretech/airbroke/commit/9daf70bb4a40b3e3e08ca6713895cf5b7067ddf9))
* **.env.dist:** update AIRBROKE_CORS_ORIGINS value to use a more generic domain name for the example browser app deployment ([36b0050](https://github.com/icoretech/airbroke/commit/36b0050bd238a3b17b912b3e9e6714dc061b7c5b))
* add @testing-library/jest-dom/extend-expect import to testSetup.ts to extend jest-dom matchers ([c2a9cd6](https://github.com/icoretech/airbroke/commit/c2a9cd69090c44f701963fcff46fbec5fb49a5c0))
* add npm-check-updates scripts to package.json to check and update dependencies ([b13c66d](https://github.com/icoretech/airbroke/commit/b13c66df9383c44fd6326641f8c4ff5926f64c11))
* add test_next_data volume to docker-compose.yml to persist .next folder between test runs ([c2a9cd6](https://github.com/icoretech/airbroke/commit/c2a9cd69090c44f701963fcff46fbec5fb49a5c0))
* **AI.tsx:** add buttons to toggle between regular and detailed completion requests ([d5f7968](https://github.com/icoretech/airbroke/commit/d5f7968a93c9548205a30c7849d97e5dfd0d745c))
* **AI.tsx:** add support for 'isDetailMode' state to determine whether to include extra data in the completion request, closes https://github.com/icoretech/airbroke/issues/74 ([d5f7968](https://github.com/icoretech/airbroke/commit/d5f7968a93c9548205a30c7849d97e5dfd0d745c))
* **ai/route.ts:** add support for AIRBROKE_OPENAI_ORGANIZATION environment variable to be able to use OpenAI API with organization key ([7eba281](https://github.com/icoretech/airbroke/commit/7eba2810457280fa5722b9820038e9f7ee07823e))
* **Backtrace.tsx:** add plain text copy button to backtrace component ([19e9746](https://github.com/icoretech/airbroke/commit/19e974622c2e3e97da93e95888539633c24b88e6))
* **completion/route.ts:** use vercel/ai instead of chatgpt, closes https://github.com/icoretech/airbroke/issues/101 ([b7c487b](https://github.com/icoretech/airbroke/commit/b7c487be68ffeae09e7d9d6eeb1d7d7a6465f288))
* **DangerZone.tsx:** add toggle intake component to danger zone card, closes https://github.com/icoretech/airbroke/issues/52 ([b28a057](https://github.com/icoretech/airbroke/commit/b28a057a2ee5cc8dd504c73f7e90758486a6c188))
* **db.ts:** add support for excluding logging when running in a testing environment by checking the value of TESTING environment variable ([6123d12](https://github.com/icoretech/airbroke/commit/6123d12f3891199bd429792b9626e5bbf9299c50))
* **db.ts:** refactor prisma initialization ([a513e31](https://github.com/icoretech/airbroke/commit/a513e31921133efa5316be1bb02a6f8150063007))
* **db.ts:** update PrismaClient initialization to include query logging in development environment ([6e0c4d7](https://github.com/icoretech/airbroke/commit/6e0c4d7a87f12ad8904d80addaef74cb653d03aa))
* disable caching on individual pages, make use of our customCache ([2e17c20](https://github.com/icoretech/airbroke/commit/2e17c2090a2211cc995da70f4a7fd24bb449c430))
* enhance transitions for mobile sidebar ([85f483a](https://github.com/icoretech/airbroke/commit/85f483a38ca19bf81daea2fedd57005c709ee6db))
* **Form.tsx:** add button to create a project without a repository and handle form submission when no repository is provided ([198cb3d](https://github.com/icoretech/airbroke/commit/198cb3dd5be3aaa90ec96921352ab7f0a3df4b0a))
* **lib/cache.ts:** add customCache function to enable caching of function results ([9daf70b](https://github.com/icoretech/airbroke/commit/9daf70bb4a40b3e3e08ca6713895cf5b7067ddf9))
* **migration.sql:** add migration to make repo_branch field optional in projects table ([c528e80](https://github.com/icoretech/airbroke/commit/c528e806a7577ee39db2f2f07ed478e072fb5f0d))
* **next.config.js:** add logging configuration based on AIRBROKE_LOG_LEVEL environment variable to enable verbose logging if set to 'verbose' ([264015c](https://github.com/icoretech/airbroke/commit/264015c8b6c3df355696fe1fdc93a439f8d3728e))
* **not-found.tsx:** add NotFound component, this might allow next.js to skip a whole renderer process at runtime, because at the moment the 404 page is recognized as a pages app ([98a2a1c](https://github.com/icoretech/airbroke/commit/98a2a1c04187222482ec741ebcea0d290176cf00))
* **notices.ts:** add _fetchNoticeIdsByProjectId and _fetchNoticeEnvs helper functions to encapsulate database queries for fetching notice IDs and environments by project ID ([334dfee](https://github.com/icoretech/airbroke/commit/334dfeeb7f4b14980bba9c52816ab776251da756))
* **notices.ts:** add support for limiting the number of notices returned by getNotices function ([8d09776](https://github.com/icoretech/airbroke/commit/8d09776002d27459919d452ca581c272a7bffa5c))
* **occurrence:** add resolve button to occurrence page and table to allow users to mark an occurrence as resolved or reinstate it, refs https://github.com/icoretech/airbroke/issues/33 ([b6ce009](https://github.com/icoretech/airbroke/commit/b6ce009bbba92277cf0384512202762e8b51194f))
* **occurrence:** add resolved_at field to occurrence model to track when an occurrence was resolved ([b6ce009](https://github.com/icoretech/airbroke/commit/b6ce009bbba92277cf0384512202762e8b51194f))
* **Overview.tsx:** add project status to project overview ([b28a057](https://github.com/icoretech/airbroke/commit/b28a057a2ee5cc8dd504c73f7e90758486a6c188))
* **package.json:** add 'npm-check-updates' as a new dev dependency to manage package updates ([486043d](https://github.com/icoretech/airbroke/commit/486043d6e17d7ce5c75ab307c91e56ebbdb28d8e))
* **package.json:** update next.js and related packages to stable version 13.4.5 ([ace107a](https://github.com/icoretech/airbroke/commit/ace107a3686021e1c86bcbbd0a614b9c4d798841))
* **page.tsx:** mobile tabs, refs https://github.com/icoretech/airbroke/issues/24 ([58fa86b](https://github.com/icoretech/airbroke/commit/58fa86bdb213ed414f2e8ed12e1303d02b28af0d))
* **page.tsx:** responsive tabs in project edit, closes https://github.com/icoretech/airbroke/issues/24 ([6f16168](https://github.com/icoretech/airbroke/commit/6f161681bc07413ee1996a1af892b08ec1637809))
* **projectActions.ts:** add functionality to create a project without a repository when no data is provided ([198cb3d](https://github.com/icoretech/airbroke/commit/198cb3dd5be3aaa90ec96921352ab7f0a3df4b0a))
* **project:** add Edit component to allow users to edit project information, closes https://github.com/icoretech/airbroke/issues/14 ([c528e80](https://github.com/icoretech/airbroke/commit/c528e806a7577ee39db2f2f07ed478e072fb5f0d))
* **projects.ts:** add caching to the getProjectById function ([6e0c4d7](https://github.com/icoretech/airbroke/commit/6e0c4d7a87f12ad8904d80addaef74cb653d03aa))
* **projects.ts:** add caching to the getProjects function ([6e0c4d7](https://github.com/icoretech/airbroke/commit/6e0c4d7a87f12ad8904d80addaef74cb653d03aa))
* **projects.ts:** add caching to the getProjectsGroupedByOrganization function ([6e0c4d7](https://github.com/icoretech/airbroke/commit/6e0c4d7a87f12ad8904d80addaef74cb653d03aa))
* **projects.ts:** add updateProject function to update project data with form data ([c528e80](https://github.com/icoretech/airbroke/commit/c528e806a7577ee39db2f2f07ed478e072fb5f0d))
* **projects.ts:** add zod, zod-error, and zod-form-data dependencies to validate form data ([c528e80](https://github.com/icoretech/airbroke/commit/c528e806a7577ee39db2f2f07ed478e072fb5f0d))
* **queries/notices.ts:** add caching to fetchNotices and fetchNoticeById functions ([6e0c4d7](https://github.com/icoretech/airbroke/commit/6e0c4d7a87f12ad8904d80addaef74cb653d03aa))
* **queries/occurrenceBookmarks.ts:** add caching to fetchOccurrenceBookmarks function ([6e0c4d7](https://github.com/icoretech/airbroke/commit/6e0c4d7a87f12ad8904d80addaef74cb653d03aa))
* **queries/occurrences.ts:** add caching to fetchOccurrences function ([6e0c4d7](https://github.com/icoretech/airbroke/commit/6e0c4d7a87f12ad8904d80addaef74cb653d03aa))
* **route.ts:** add support for 'sendExtraData' query parameter to include extra data in the prompt for error handling ([d5f7968](https://github.com/icoretech/airbroke/commit/d5f7968a93c9548205a30c7849d97e5dfd0d745c))
* **route.ts:** truncate the prompt to fit within the OpenAI token limit of 4096 tokens ([d5f7968](https://github.com/icoretech/airbroke/commit/d5f7968a93c9548205a30c7849d97e5dfd0d745c))
* **route.ts:** update default OpenAI engine model from 'gpt-4' to 'gpt-3.5-turbo' if nothing is set ([07d4f9f](https://github.com/icoretech/airbroke/commit/07d4f9fa301227cd734dcf1fc5e5b580b739d739))
* **route.ts:** update OpenAI initialization to use the new OpenAI constructor and include organization parameter if available ([e68163c](https://github.com/icoretech/airbroke/commit/e68163cd0e10826c71f7002a1f1b972dcac5c127))
* **route.ts:** use configurable OpenAI engine from environment variable AIRBROKE_OPENAI_ENGINE ([a3a695f](https://github.com/icoretech/airbroke/commit/a3a695fa82a8f81a008bf5a9caf83375ec79ecbd))
* **schema.prisma:** make repo_branch field optional ([c528e80](https://github.com/icoretech/airbroke/commit/c528e806a7577ee39db2f2f07ed478e072fb5f0d))
* **sidebar:** Implement hybrid approach for "Bookmarks" link active state ([70c1c62](https://github.com/icoretech/airbroke/commit/70c1c626d43092f6804cfbc6a04c4fc06af1e65b))
* **SparkLine.tsx:** add Sparkline component to render a line chart based on provided data, to be used later ([859fb84](https://github.com/icoretech/airbroke/commit/859fb8454c489f746269493c7e41db609398361a))
* switch to fork of react-icons ([64b8d49](https://github.com/icoretech/airbroke/commit/64b8d49a04c4e8965628f0b7caf0f806b8d3c645))
* **ToggleIntake.tsx:** add toggle intake component to allow pausing and resuming of project data intake ([b28a057](https://github.com/icoretech/airbroke/commit/b28a057a2ee5cc8dd504c73f7e90758486a6c188))


### Bug Fixes

* **ActionsMenu.tsx:** update z-index value in ProjectActionsMenu component to prevent overlap with other elements ([e4d9d5f](https://github.com/icoretech/airbroke/commit/e4d9d5fa0909671f8b38d997d4dbef933c272fd0))
* **AI.tsx:** scroll textarea to bottom when completion or error changes ([a3a695f](https://github.com/icoretech/airbroke/commit/a3a695fa82a8f81a008bf5a9caf83375ec79ecbd))
* **airbrakeActions.ts:** change import statement for revalidatePath from 'next/cache' to 'next/cache' to fix import error ([71b819d](https://github.com/icoretech/airbroke/commit/71b819dc851200166c352c9ea611c02009f37fd5))
* **airbrakeActions.ts:** change revalidatePath calls to revalidateTag to fix deprecated method call and improve caching ([71b819d](https://github.com/icoretech/airbroke/commit/71b819dc851200166c352c9ea611c02009f37fd5))
* **api/ai/route.ts:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **api/hc/route.ts:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **api/v3/notices/route.ts:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **auth.ts:** update import statement for prisma from "./db" to "@/lib/db" ([930dbc0](https://github.com/icoretech/airbroke/commit/930dbc06717edbd2c44effdedb514441050e698a))
* **Background.tsx:** update fill attribute to use the simplified pattern id for better semantics ([fd0e6a5](https://github.com/icoretech/airbroke/commit/fd0e6a58fb26d81065aa936699e65f6907114264))
* **Breadcrumbs.tsx:** add Projects link to breadcrumbs for easier navigation ([f6e6797](https://github.com/icoretech/airbroke/commit/f6e6797e0cb6cab71d414ac273c275b9b209a507))
* **components/OccurrenceChartWrapper.tsx:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **components/project/OccurrencesChartWrapper.tsx:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **db.ts:** update PrismaClient initialization to conditionally log queries and warnings based on NODE_ENV environment variable ([7bd6e6d](https://github.com/icoretech/airbroke/commit/7bd6e6dc31cd6d6d499200171dc8b377768d9f04))
* **deps:** update dependency @headlessui/react to v1.7.16 ([#160](https://github.com/icoretech/airbroke/issues/160)) ([44d7fa7](https://github.com/icoretech/airbroke/commit/44d7fa76daf99bf9a8b46c0ff1bebccc8f9a7111))
* **deps:** update dependency @headlessui/react to v1.7.17 ([51f03cc](https://github.com/icoretech/airbroke/commit/51f03cc172667e3083c59a8f0a9ad1ae3b6f9957))
* **deps:** update dependency @headlessui/react to v1.7.18 ([7ac4966](https://github.com/icoretech/airbroke/commit/7ac4966814b4efff9345e37b81bb2fdf2ac47033))
* **deps:** update dependency @headlessui/react to v1.7.19 ([d3eaab3](https://github.com/icoretech/airbroke/commit/d3eaab3d53ec01bddecee6a0ebf946b3ba5fdc7f))
* **deps:** update dependency @tailwindcss/forms to v0.5.4 ([0dfd302](https://github.com/icoretech/airbroke/commit/0dfd302fba7a43a7662f103722d2d49b8a94face))
* **deps:** update dependency @tailwindcss/forms to v0.5.5 ([18ad385](https://github.com/icoretech/airbroke/commit/18ad38531df7fb7e3a78323aa7454ae9119d9a4d))
* **deps:** update dependency @tailwindcss/forms to v0.5.6 ([19bcae0](https://github.com/icoretech/airbroke/commit/19bcae047214e574a67053e2011f5adcf3f58633))
* **deps:** update dependency @tailwindcss/forms to v0.5.7 ([a1500e0](https://github.com/icoretech/airbroke/commit/a1500e03fdc30578781328cea90e236ea0bb353b))
* **deps:** update dependency ai to v2.1.18 ([#115](https://github.com/icoretech/airbroke/issues/115)) ([23af4ea](https://github.com/icoretech/airbroke/commit/23af4ea070d2ff3f1d0afb33d7857a900360efaa))
* **deps:** update dependency ai to v2.1.19 ([0ba5d9d](https://github.com/icoretech/airbroke/commit/0ba5d9d86829aac16aaa07bd3081c1bff9ffe170))
* **deps:** update dependency ai to v2.1.20 ([#123](https://github.com/icoretech/airbroke/issues/123)) ([6efd275](https://github.com/icoretech/airbroke/commit/6efd275746050c1eea0218816e9869acdc65a2e3))
* **deps:** update dependency ai to v2.1.21 ([7379260](https://github.com/icoretech/airbroke/commit/73792609aafab6c9ae8592fc8cfcc7a816d293b3))
* **deps:** update dependency ai to v2.1.22 ([#133](https://github.com/icoretech/airbroke/issues/133)) ([5032204](https://github.com/icoretech/airbroke/commit/5032204f7d58119822bd12c233d34c29816680cc))
* **deps:** update dependency ai to v2.1.25 ([03692c8](https://github.com/icoretech/airbroke/commit/03692c80ad18600ff5f9577864f89553ebd2ae02))
* **deps:** update dependency ai to v2.1.26 ([c036dd7](https://github.com/icoretech/airbroke/commit/c036dd7b8366c126a8305a933874697ab9183ecf))
* **deps:** update dependency ai to v2.1.27 ([#161](https://github.com/icoretech/airbroke/issues/161)) ([3521094](https://github.com/icoretech/airbroke/commit/352109495afbd6b3d512846541408f74c4e93165))
* **deps:** update dependency ai to v2.1.28 ([9879eea](https://github.com/icoretech/airbroke/commit/9879eea1b3a05399ce0dcc62487443ac59df54a4))
* **deps:** update dependency ai to v2.1.29 ([65d4f63](https://github.com/icoretech/airbroke/commit/65d4f637f7ae31e06976deaa6800b56646e73300))
* **deps:** update dependency ai to v2.1.31 ([e523954](https://github.com/icoretech/airbroke/commit/e52395416a219086670c3f3b2a38dbe9087fe04b))
* **deps:** update dependency ai to v2.1.32 ([5efda25](https://github.com/icoretech/airbroke/commit/5efda2583fc884e4b4dfcb19d47f17c7160cf341))
* **deps:** update dependency ai to v2.1.33 ([d9e258c](https://github.com/icoretech/airbroke/commit/d9e258cc7100835789b0784d1ea7d5d4598e7b81))
* **deps:** update dependency ai to v2.1.34 ([b5a4cce](https://github.com/icoretech/airbroke/commit/b5a4cce8385745588c108d4122cf86db0e3ee8b9))
* **deps:** update dependency ai to v2.2.10 ([a543fd9](https://github.com/icoretech/airbroke/commit/a543fd9002864ff0b4998a2d51f38ecf7b1fb3b6))
* **deps:** update dependency ai to v2.2.11 ([5bee61f](https://github.com/icoretech/airbroke/commit/5bee61f426162ab6d2c3e62960668d6ab12632ad))
* **deps:** update dependency ai to v2.2.12 ([be8fc98](https://github.com/icoretech/airbroke/commit/be8fc98e72c6b34e6695c7e9de1e2169514d6d92))
* **deps:** update dependency ai to v2.2.13 ([8756ab9](https://github.com/icoretech/airbroke/commit/8756ab91660c81326b123794ffb36fd23139ce08))
* **deps:** update dependency ai to v2.2.2 ([#221](https://github.com/icoretech/airbroke/issues/221)) ([ace664b](https://github.com/icoretech/airbroke/commit/ace664bfc2ab27e2a98b5f20ceb554c766193c89))
* **deps:** update dependency ai to v2.2.6 ([43e5f6b](https://github.com/icoretech/airbroke/commit/43e5f6b0c4053c41a160a1e80f978cdd4eeb82f4))
* **deps:** update dependency ai to v2.2.7 ([e08b410](https://github.com/icoretech/airbroke/commit/e08b4101ab080bf74cc58a2c9ff85a5c6123cb0d))
* **deps:** update dependency ai to v2.2.8 ([db0a1f2](https://github.com/icoretech/airbroke/commit/db0a1f223ad156798f58bca3b8bd82f930a86e8c))
* **deps:** update dependency ai to v2.2.9 ([dd9dca6](https://github.com/icoretech/airbroke/commit/dd9dca65bb253121ee2a3f28c288546272ea9dd5))
* **deps:** update dependency autoprefixer to v10.4.15 ([13a4c76](https://github.com/icoretech/airbroke/commit/13a4c766a9bb562f71e8ba9d1948cfbf39c0f57b))
* **deps:** update dependency autoprefixer to v10.4.16 ([0beba52](https://github.com/icoretech/airbroke/commit/0beba5258cb8a5cce4202852defb60da7cb31c48))
* **deps:** update dependency autoprefixer to v10.4.17 ([c67f870](https://github.com/icoretech/airbroke/commit/c67f8706a40a3fa5f24bbbf20bb5f4ab7d873f75))
* **deps:** update dependency autoprefixer to v10.4.18 ([a7639b7](https://github.com/icoretech/airbroke/commit/a7639b7aa4e2e3d321f951ac6118df0a3a702f07))
* **deps:** update dependency autoprefixer to v10.4.19 ([e960e6a](https://github.com/icoretech/airbroke/commit/e960e6a735f30330b2c4fcff80eaeeb08c9d3043))
* **deps:** update dependency chart.js to v4.3.1 ([3f190a5](https://github.com/icoretech/airbroke/commit/3f190a50a05f7650a8876a46527f2bddea130fc0))
* **deps:** update dependency chart.js to v4.3.2 ([#155](https://github.com/icoretech/airbroke/issues/155)) ([79070de](https://github.com/icoretech/airbroke/commit/79070de0755b43f68e5ccab2c691090ed82849d2))
* **deps:** update dependency chart.js to v4.3.3 ([e52e727](https://github.com/icoretech/airbroke/commit/e52e7275dabbd2acc277e4a87e39daf65a3158db))
* **deps:** update dependency chart.js to v4.4.0 ([4f408bf](https://github.com/icoretech/airbroke/commit/4f408bf704752cf5162b942349c90c75ad4ad85e))
* **deps:** update dependency chart.js to v4.4.1 ([8a59317](https://github.com/icoretech/airbroke/commit/8a5931797dbe249888486d16da7d17fd539ee961))
* **deps:** update dependency chart.js to v4.4.2 ([8e96a9a](https://github.com/icoretech/airbroke/commit/8e96a9ac04782c6b8d54f6588300df9856f5d1f5))
* **deps:** update dependency nanoid to v5 ([#279](https://github.com/icoretech/airbroke/issues/279)) ([ae5114e](https://github.com/icoretech/airbroke/commit/ae5114e13d13c1bd9af57558daed74d426614135))
* **deps:** update dependency nanoid to v5.0.2 ([aa1da64](https://github.com/icoretech/airbroke/commit/aa1da6489696f04fac982195997449a4d66d2a4b))
* **deps:** update dependency nanoid to v5.0.3 ([cecc1f8](https://github.com/icoretech/airbroke/commit/cecc1f860f85bb273b067d42703e3d678b0c82ae))
* **deps:** update dependency nanoid to v5.0.4 ([c9e18d8](https://github.com/icoretech/airbroke/commit/c9e18d80858799f594d0a26b1e4ffaa43342b50b))
* **deps:** update dependency nanoid to v5.0.5 ([1f9d184](https://github.com/icoretech/airbroke/commit/1f9d18443bbab47a2d2d54ed3d4c5764e6cb1031))
* **deps:** update dependency nanoid to v5.0.6 ([83e7642](https://github.com/icoretech/airbroke/commit/83e7642615b24c54f9895f04578eea350bab190f))
* **deps:** update dependency nanoid to v5.0.7 ([f46a2df](https://github.com/icoretech/airbroke/commit/f46a2dfd29812dffdb0e93f574b76f36eff96bee))
* **deps:** update dependency next-auth to v4.22.3 ([19c8961](https://github.com/icoretech/airbroke/commit/19c896102fa8ed216ed7891124674289982eefd3))
* **deps:** update dependency next-auth to v4.22.4 ([8988322](https://github.com/icoretech/airbroke/commit/898832213f47e85b3dabe4eb8ab22d7779859482))
* **deps:** update dependency next-auth to v4.22.5 ([#190](https://github.com/icoretech/airbroke/issues/190)) ([119be32](https://github.com/icoretech/airbroke/commit/119be32fc815756f6a5d76dee1d54a0a534209f7))
* **deps:** update dependency next-auth to v4.23.0 ([97bc9a8](https://github.com/icoretech/airbroke/commit/97bc9a8be748ce958a50c3488fbd2eff850c5b58))
* **deps:** update dependency next-auth to v4.23.1 ([bff1e15](https://github.com/icoretech/airbroke/commit/bff1e1506b6e245c87786f8a93ef083c856ac4af))
* **deps:** update dependency next-auth to v4.23.2 ([ad5bfc3](https://github.com/icoretech/airbroke/commit/ad5bfc304913c2fd9c2b9d2e4a08a38ddcfcea9c))
* **deps:** update dependency next-auth to v4.24.3 ([0f13ab7](https://github.com/icoretech/airbroke/commit/0f13ab77413085a466a5599d199fb7d0bb5480c7))
* **deps:** update dependency next-auth to v4.24.4 ([4f6830c](https://github.com/icoretech/airbroke/commit/4f6830c3bc77734898cf59566dffffe55cabce8a))
* **deps:** update dependency next-auth to v4.24.5 ([6dd9ca3](https://github.com/icoretech/airbroke/commit/6dd9ca370ac7aa657ac211050436dd8c2a7060d0))
* **deps:** update dependency next-auth to v4.24.6 ([4b0a13a](https://github.com/icoretech/airbroke/commit/4b0a13a7c235a3c5a685ddff910ba08ca6cc347e))
* **deps:** update dependency next-auth to v4.24.7 ([65471a3](https://github.com/icoretech/airbroke/commit/65471a343e66b6da492b61ea3cc757e61bac55ce))
* **deps:** update dependency octokit to v3.1.0 ([#157](https://github.com/icoretech/airbroke/issues/157)) ([1b5d24e](https://github.com/icoretech/airbroke/commit/1b5d24e2406d84b589ea0d7b5fc70db1b41d7eb7))
* **deps:** update dependency octokit to v3.1.1 ([c648309](https://github.com/icoretech/airbroke/commit/c648309215407643b2ac8b677ab2f51865fe9bb9))
* **deps:** update dependency octokit to v3.1.2 ([9b6d9a6](https://github.com/icoretech/airbroke/commit/9b6d9a6f15b8e4ddbcc88e3ef76eabacd8753778))
* **deps:** update dependency octokit to v3.2.0 ([089ffea](https://github.com/icoretech/airbroke/commit/089ffea860f75cab6d4ddc9091949bc800bfb64e))
* **deps:** update dependency openai-edge to v1.2.1 ([#140](https://github.com/icoretech/airbroke/issues/140)) ([919bc7a](https://github.com/icoretech/airbroke/commit/919bc7aeb756697d788027ceed1e363e4ebb72cd))
* **deps:** update dependency openai-edge to v1.2.2 ([#150](https://github.com/icoretech/airbroke/issues/150)) ([9b4bca3](https://github.com/icoretech/airbroke/commit/9b4bca395801624db551901b63d1aea95aa00036))
* **deps:** update dependency postcss to v8.4.25 ([4dacb8d](https://github.com/icoretech/airbroke/commit/4dacb8d15314f617c816f8d67b4c640a8291d8f6))
* **deps:** update dependency postcss to v8.4.26 ([#124](https://github.com/icoretech/airbroke/issues/124)) ([60dfa5c](https://github.com/icoretech/airbroke/commit/60dfa5cebc98b991ad20e1d0a508d14a97c09c04))
* **deps:** update dependency postcss to v8.4.28 ([#216](https://github.com/icoretech/airbroke/issues/216)) ([659e306](https://github.com/icoretech/airbroke/commit/659e30642b759ad7a4361972bf641baf90cb6548))
* **deps:** update dependency postcss to v8.4.29 ([eb86262](https://github.com/icoretech/airbroke/commit/eb86262c9f739874c2fa6399bdec30b47e27b73b))
* **deps:** update dependency postcss to v8.4.30 ([3000ca3](https://github.com/icoretech/airbroke/commit/3000ca34aadf9235d4844f928d9cd1cc5de694f9))
* **deps:** update dependency postcss to v8.4.31 ([c1a9676](https://github.com/icoretech/airbroke/commit/c1a9676957d2fe90c846b11ac1b6a3f92f112329))
* **deps:** update dependency postcss to v8.4.32 ([0b824f3](https://github.com/icoretech/airbroke/commit/0b824f3284b55c8dd7e3b6c4223ed945757763c5))
* **deps:** update dependency postcss to v8.4.33 ([2094c3a](https://github.com/icoretech/airbroke/commit/2094c3a7f0a8040e368b057298b6fcaff27d12ec))
* **deps:** update dependency postcss to v8.4.34 ([ccbe08a](https://github.com/icoretech/airbroke/commit/ccbe08a6f7a851e2c3a139bdc4646db0be631844))
* **deps:** update dependency postcss to v8.4.35 ([03a29ef](https://github.com/icoretech/airbroke/commit/03a29ef2b0bc3b9555d865bab89096fc5c68759a))
* **deps:** update dependency postcss to v8.4.38 ([adbd1a7](https://github.com/icoretech/airbroke/commit/adbd1a75a2ff3746563f9b6c568dc8a6a5da9e56))
* **deps:** update dependency prettier to v3 ([#98](https://github.com/icoretech/airbroke/issues/98)) ([7e31a4c](https://github.com/icoretech/airbroke/commit/7e31a4c9fa01c9cc3985289dae9e3fc522aecc79))
* **deps:** update dependency react-icons-ng to v4.9.1 ([bbf05e6](https://github.com/icoretech/airbroke/commit/bbf05e6a67135879f610cccfdd255f9142712c12))
* **deps:** update dependency sharp to v0.32.3 ([#111](https://github.com/icoretech/airbroke/issues/111)) ([6bb08df](https://github.com/icoretech/airbroke/commit/6bb08dfc24400ee4f5fc5b4f51afa63faf7c4b61))
* **deps:** update dependency sharp to v0.32.5 ([#217](https://github.com/icoretech/airbroke/issues/217)) ([8bf2a49](https://github.com/icoretech/airbroke/commit/8bf2a491d06f1053ff1764e9bda70277297a3d52))
* **deps:** update dependency sharp to v0.32.6 ([ffe1803](https://github.com/icoretech/airbroke/commit/ffe1803777d097ba36a796fd3110e478948fac34))
* **deps:** update dependency sharp to v0.33.0 ([7c4118e](https://github.com/icoretech/airbroke/commit/7c4118e27c9e2c8914d30157ab126e424afe6586))
* **deps:** update dependency sharp to v0.33.2 ([6b44cfd](https://github.com/icoretech/airbroke/commit/6b44cfd4c587bc93360459850132f9a76e01a760))
* **deps:** update dependency sharp to v0.33.3 ([e19c480](https://github.com/icoretech/airbroke/commit/e19c4805e8caf6f2602c592a8585193024c45e8e))
* **deps:** update dependency superjson to v1.13.1 ([#132](https://github.com/icoretech/airbroke/issues/132)) ([a823e8a](https://github.com/icoretech/airbroke/commit/a823e8a27bdeb5d96fd1b29da93e9f6abcad150a))
* **deps:** update dependency superjson to v1.13.3 ([2678fbc](https://github.com/icoretech/airbroke/commit/2678fbc4e50839bb4d6f2fd897d58ee215899577))
* **deps:** update dependency superjson to v2 ([#331](https://github.com/icoretech/airbroke/issues/331)) ([e0f7409](https://github.com/icoretech/airbroke/commit/e0f7409aa3345c113956a6667382d1cd43ec1d39))
* **deps:** update dependency tailwindcss to v3.3.3 ([#125](https://github.com/icoretech/airbroke/issues/125)) ([67569b0](https://github.com/icoretech/airbroke/commit/67569b0043f94238b37c9735fad62c97e01e531f))
* **deps:** update dependency tailwindcss to v3.3.4 ([d38d4d3](https://github.com/icoretech/airbroke/commit/d38d4d37f325e7b86fd540cbd627d7240c2299c5))
* **deps:** update dependency tailwindcss to v3.3.5 ([0904573](https://github.com/icoretech/airbroke/commit/09045737755651b3b642b2e9a175f5c299de378a))
* **deps:** update dependency tailwindcss to v3.3.6 ([600d060](https://github.com/icoretech/airbroke/commit/600d060f916d3e9e573297258363bfbf76139172))
* **deps:** update dependency tailwindcss to v3.4.1 ([e2bca53](https://github.com/icoretech/airbroke/commit/e2bca537282582fdf0b42ec394406bdeb97da2b2))
* **deps:** update dependency tailwindcss to v3.4.3 ([1fd9170](https://github.com/icoretech/airbroke/commit/1fd9170b6bf19e5a63469e69fb108fe4c5e65820))
* **deps:** update dependency typescript to v5.2.2 ([ec98439](https://github.com/icoretech/airbroke/commit/ec9843950f70a8685feeab80c3961ba46acc27fb))
* **deps:** update dependency typescript to v5.3.2 ([62e46a9](https://github.com/icoretech/airbroke/commit/62e46a98ed22ccb3273defa0cc3042fb591026f5))
* **deps:** update dependency typescript to v5.3.3 ([bdc7258](https://github.com/icoretech/airbroke/commit/bdc72581bc246c6e84d21cf8444e71f2a5b59311))
* **deps:** update dependency typescript to v5.4.2 ([c5af73d](https://github.com/icoretech/airbroke/commit/c5af73d690238b7dc88b1645a4d981e3e9eed6a0))
* **deps:** update dependency typescript to v5.4.4 ([c0da804](https://github.com/icoretech/airbroke/commit/c0da8044f8f7ba32ed33cb595784a496272a8977))
* **deps:** update dependency typescript to v5.4.5 ([55df06a](https://github.com/icoretech/airbroke/commit/55df06ac191f65591500dda725a56fb98ff54ca9))
* **deps:** update dependency zod to v3.22.0 ([3a8781a](https://github.com/icoretech/airbroke/commit/3a8781a057e1deef522f4566344da82d3e47afc1))
* **deps:** update dependency zod to v3.22.1 ([#218](https://github.com/icoretech/airbroke/issues/218)) ([5ddc22b](https://github.com/icoretech/airbroke/commit/5ddc22b471e4fc2012c1c025c1f6a717987d4b80))
* **deps:** update dependency zod to v3.22.2 ([#229](https://github.com/icoretech/airbroke/issues/229)) ([a043ea9](https://github.com/icoretech/airbroke/commit/a043ea90ea35a321d0dcef22711a8f34ece256cf))
* **deps:** update dependency zod to v3.22.3 ([99d1f11](https://github.com/icoretech/airbroke/commit/99d1f116328629feff6a202e06de3f4c0642e055))
* **deps:** update dependency zod to v3.22.4 ([09ab904](https://github.com/icoretech/airbroke/commit/09ab9040201d0b99118f4bfb3815fa4082311912))
* **deps:** update dependency zod to v3.22.5 ([3f8b765](https://github.com/icoretech/airbroke/commit/3f8b7658c03ad2d03c73e6bcbc12633fc7d45135))
* **deps:** update dependency zod-form-data to v2.0.2 ([9a59acf](https://github.com/icoretech/airbroke/commit/9a59acf245c7c945dd4a277862d9eaae28fc8bf2))
* **deps:** update prisma monorepo to v5.1.0 ([adb80ab](https://github.com/icoretech/airbroke/commit/adb80abecd34ac73f262a85e8ab0f8b80265bca6))
* **deps:** update prisma monorepo to v5.1.1 ([7e834ce](https://github.com/icoretech/airbroke/commit/7e834ce835516e54287fa0b7627d77251eec06ee))
* **deps:** update prisma monorepo to v5.10.2 ([b993453](https://github.com/icoretech/airbroke/commit/b99345385a7045228fcea1bad2999eb5efafca66))
* **deps:** update prisma monorepo to v5.11.0 ([3acb986](https://github.com/icoretech/airbroke/commit/3acb986512d2a6b6f1a89de2e006949e303882c5))
* **deps:** update prisma monorepo to v5.12.1 ([56bf49e](https://github.com/icoretech/airbroke/commit/56bf49ea9e929ca8f488fcb2ad917091abefdabb))
* **deps:** update prisma monorepo to v5.13.0 ([dfba5ae](https://github.com/icoretech/airbroke/commit/dfba5ae5d9e4e0558471f4e2ecf6af10ba3a2a04))
* **deps:** update prisma monorepo to v5.2.0 ([7a3d33d](https://github.com/icoretech/airbroke/commit/7a3d33dff439fede96f19b2b5340c176bce08dcb))
* **deps:** update prisma monorepo to v5.3.0 ([f039779](https://github.com/icoretech/airbroke/commit/f0397790a038bdf00d246ec2431c35c0c3a1c70d))
* **deps:** update prisma monorepo to v5.3.1 ([7f38fd1](https://github.com/icoretech/airbroke/commit/7f38fd18c74f5d51af2e409d120aa4cdc50fa2be))
* **deps:** update prisma monorepo to v5.4.1 ([259f1e5](https://github.com/icoretech/airbroke/commit/259f1e50771809115462a0597485bfe6ecfa24c9))
* **deps:** update prisma monorepo to v5.4.2 ([4830b79](https://github.com/icoretech/airbroke/commit/4830b799f1fd28b51611fd7a93f68d1c3959ac99))
* **deps:** update prisma monorepo to v5.5.0 ([d5918d2](https://github.com/icoretech/airbroke/commit/d5918d220545d3ae91bdc3080a3e6525969b681b))
* **deps:** update prisma monorepo to v5.5.2 ([11596a6](https://github.com/icoretech/airbroke/commit/11596a6c85cee4c265e3036cc1b306037c90ab08))
* **deps:** update prisma monorepo to v5.6.0 ([def53fc](https://github.com/icoretech/airbroke/commit/def53fc670d467e2c2dec2302044f2ae53633b74))
* **deps:** update prisma monorepo to v5.8.1 ([0db36cd](https://github.com/icoretech/airbroke/commit/0db36cd2a647d454c28c2cabddfc8469d7e5ffbd))
* **deps:** update prisma monorepo to v5.9.0 ([60ea80e](https://github.com/icoretech/airbroke/commit/60ea80e66341e68da0bbde40b60b407a78bf5130))
* **deps:** update prisma monorepo to v5.9.1 ([dbab0ec](https://github.com/icoretech/airbroke/commit/dbab0ecf230023d908a91e75ccc5591a7fa122e5))
* **Dockerfile:** update COPY commands to use --link flag ([00f957c](https://github.com/icoretech/airbroke/commit/00f957c094b071895efe1e0dd0af8a0a76f5d103))
* **Filter.tsx:** update z-index value in Filter component to prevent overlap with other elements ([1cb0fd9](https://github.com/icoretech/airbroke/commit/1cb0fd9697e91e870774b22bf70e80d35eca41bf))
* **Form.tsx:** change import statement for useRouter from 'next/navigation' to 'next/router' to fix import error ([71b819d](https://github.com/icoretech/airbroke/commit/71b819dc851200166c352c9ea611c02009f37fd5))
* **Form.tsx:** change import statement for useTransition from 'react' to 'react' to fix import error ([71b819d](https://github.com/icoretech/airbroke/commit/71b819dc851200166c352c9ea611c02009f37fd5))
* **Form.tsx:** resolves warning: Cannot specify a "name" prop for a button that specifies a function as a formAction ([9711a11](https://github.com/icoretech/airbroke/commit/9711a1157891a2b740ab3399c7cef6d8b36d850a))
* hide open sidebar button when not necessary ([64b8d49](https://github.com/icoretech/airbroke/commit/64b8d49a04c4e8965628f0b7caf0f806b8d3c645))
* increase max_connections to 23 in db service command in docker-compose.yml to avoid connection errors ([c2a9cd6](https://github.com/icoretech/airbroke/commit/c2a9cd69090c44f701963fcff46fbec5fb49a5c0))
* **lib/actions/occurrenceActions.ts:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **lib/actions/projectActions.ts:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **lib/processError.ts:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **lib/queries/notices.ts:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **lib/queries/occurrenceBookmarks.ts:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **lib/queries/occurrences.ts:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **lib/queries/projects.ts:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **middleware.ts:** update the matcher regular expression to exclude the _vercel directory from being matched ([e8cbcaa](https://github.com/icoretech/airbroke/commit/e8cbcaab00355e11eccedc8179d52a6450a99cbb))
* **OccurrenceChartWrapper.tsx:** update the `OccurrencesChartWrapper` components to generate a complete list of hourly intervals for the past 14 days and fill in the occurrence counts. If there were no occurrences for a certain hour, it now displays zero on the chart, rather than skipping that hour ([0b42ae2](https://github.com/icoretech/airbroke/commit/0b42ae21c34a383c6b8e77083657072330a324bd))
* **occurrences.ts:** unlimited data can crash prisma, default to 100 for now ([9d25777](https://github.com/icoretech/airbroke/commit/9d25777b8d20b4db4b289c0a45271c1fc7ddbae4))
* **package.json:** update ai package version to 2.2.1 for compatibility and bug fixes ([e68163c](https://github.com/icoretech/airbroke/commit/e68163cd0e10826c71f7002a1f1b972dcac5c127))
* **page.tsx:** reorganize JSX structure for better readability and maintainability ([f6e6797](https://github.com/icoretech/airbroke/commit/f6e6797e0cb6cab71d414ac273c275b9b209a507))
* **processError:** auto reinstate an occurrence when it is processed again ([b6ce009](https://github.com/icoretech/airbroke/commit/b6ce009bbba92277cf0384512202762e8b51194f))
* **project:** display 'Not set' for repository URL and main branch if they are not set ([c528e80](https://github.com/icoretech/airbroke/commit/c528e806a7577ee39db2f2f07ed478e072fb5f0d))
* **projects/page.tsx:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))
* **route.ts:** change the URL in the responseJSON to remove "/notices" from the URL ([e9f4ec6](https://github.com/icoretech/airbroke/commit/e9f4ec693306789afbde04dbec4eb35a33b862b2))
* **route.ts:** include CORS headers in error responses to allow cross-origin requests ([08f997d](https://github.com/icoretech/airbroke/commit/08f997d25175ff32406253e25bb0a7cde8ba63d5))
* **route.ts:** include CORS headers in successful responses to allow cross-origin requests ([08f997d](https://github.com/icoretech/airbroke/commit/08f997d25175ff32406253e25bb0a7cde8ba63d5))
* **route.ts:** remove unused code related to notice data ([a3a695f](https://github.com/icoretech/airbroke/commit/a3a695fa82a8f81a008bf5a9caf83375ec79ecbd))
* **route.ts:** simplify error response message when user is not logged in ([a3a695f](https://github.com/icoretech/airbroke/commit/a3a695fa82a8f81a008bf5a9caf83375ec79ecbd))
* **route.ts:** update import statement for OpenAI library to use the correct package name ([e68163c](https://github.com/icoretech/airbroke/commit/e68163cd0e10826c71f7002a1f1b972dcac5c127))
* **route.ts:** update method name for creating chat completions from createChatCompletion to chat.completions.create ([e68163c](https://github.com/icoretech/airbroke/commit/e68163cd0e10826c71f7002a1f1b972dcac5c127))
* **SidebarButtons.tsx:** update styling and icon for SidebarOpenButton ([f6e6797](https://github.com/icoretech/airbroke/commit/f6e6797e0cb6cab71d414ac273c275b9b209a507))
* **SidebarMobile.tsx:** use tailwind class ([d9df921](https://github.com/icoretech/airbroke/commit/d9df921a39b7d85c2b0841eb8c57a55b927b07ee))
* **testSetup.ts:** change import statement for prisma to use default import ([0e14177](https://github.com/icoretech/airbroke/commit/0e141777cecc5129f294b5e4e1560b2ea5a11fdc))

## [1.1.54](https://github.com/icoretech/airbroke/compare/v1.1.53...v1.1.54) (2024-04-29)


### Bug Fixes

* **deps:** update dependency superjson to v2 ([#331](https://github.com/icoretech/airbroke/issues/331)) ([e0f7409](https://github.com/icoretech/airbroke/commit/e0f7409aa3345c113956a6667382d1cd43ec1d39))
* **deps:** update prisma monorepo to v5.13.0 ([dfba5ae](https://github.com/icoretech/airbroke/commit/dfba5ae5d9e4e0558471f4e2ecf6af10ba3a2a04))

## [1.1.53](https://github.com/icoretech/airbroke/compare/v1.1.52...v1.1.53) (2024-04-19)


### Bug Fixes

* **deps:** update dependency @headlessui/react to v1.7.19 ([d3eaab3](https://github.com/icoretech/airbroke/commit/d3eaab3d53ec01bddecee6a0ebf946b3ba5fdc7f))
* **deps:** update dependency autoprefixer to v10.4.18 ([a7639b7](https://github.com/icoretech/airbroke/commit/a7639b7aa4e2e3d321f951ac6118df0a3a702f07))
* **deps:** update dependency autoprefixer to v10.4.19 ([e960e6a](https://github.com/icoretech/airbroke/commit/e960e6a735f30330b2c4fcff80eaeeb08c9d3043))
* **deps:** update dependency chart.js to v4.4.2 ([8e96a9a](https://github.com/icoretech/airbroke/commit/8e96a9ac04782c6b8d54f6588300df9856f5d1f5))
* **deps:** update dependency nanoid to v5.0.6 ([83e7642](https://github.com/icoretech/airbroke/commit/83e7642615b24c54f9895f04578eea350bab190f))
* **deps:** update dependency nanoid to v5.0.7 ([f46a2df](https://github.com/icoretech/airbroke/commit/f46a2dfd29812dffdb0e93f574b76f36eff96bee))
* **deps:** update dependency next-auth to v4.24.6 ([4b0a13a](https://github.com/icoretech/airbroke/commit/4b0a13a7c235a3c5a685ddff910ba08ca6cc347e))
* **deps:** update dependency next-auth to v4.24.7 ([65471a3](https://github.com/icoretech/airbroke/commit/65471a343e66b6da492b61ea3cc757e61bac55ce))
* **deps:** update dependency octokit to v3.2.0 ([089ffea](https://github.com/icoretech/airbroke/commit/089ffea860f75cab6d4ddc9091949bc800bfb64e))
* **deps:** update dependency postcss to v8.4.38 ([adbd1a7](https://github.com/icoretech/airbroke/commit/adbd1a75a2ff3746563f9b6c568dc8a6a5da9e56))
* **deps:** update dependency sharp to v0.33.3 ([e19c480](https://github.com/icoretech/airbroke/commit/e19c4805e8caf6f2602c592a8585193024c45e8e))
* **deps:** update dependency tailwindcss to v3.4.3 ([1fd9170](https://github.com/icoretech/airbroke/commit/1fd9170b6bf19e5a63469e69fb108fe4c5e65820))
* **deps:** update dependency typescript to v5.4.2 ([c5af73d](https://github.com/icoretech/airbroke/commit/c5af73d690238b7dc88b1645a4d981e3e9eed6a0))
* **deps:** update dependency typescript to v5.4.4 ([c0da804](https://github.com/icoretech/airbroke/commit/c0da8044f8f7ba32ed33cb595784a496272a8977))
* **deps:** update dependency typescript to v5.4.5 ([55df06a](https://github.com/icoretech/airbroke/commit/55df06ac191f65591500dda725a56fb98ff54ca9))
* **deps:** update dependency zod to v3.22.5 ([3f8b765](https://github.com/icoretech/airbroke/commit/3f8b7658c03ad2d03c73e6bcbc12633fc7d45135))
* **deps:** update prisma monorepo to v5.10.2 ([b993453](https://github.com/icoretech/airbroke/commit/b99345385a7045228fcea1bad2999eb5efafca66))
* **deps:** update prisma monorepo to v5.11.0 ([3acb986](https://github.com/icoretech/airbroke/commit/3acb986512d2a6b6f1a89de2e006949e303882c5))
* **deps:** update prisma monorepo to v5.12.1 ([56bf49e](https://github.com/icoretech/airbroke/commit/56bf49ea9e929ca8f488fcb2ad917091abefdabb))

## [1.1.52](https://github.com/icoretech/airbroke/compare/v1.1.51...v1.1.52) (2024-02-12)


### Bug Fixes

* **deps:** update dependency @headlessui/react to v1.7.18 ([7ac4966](https://github.com/icoretech/airbroke/commit/7ac4966814b4efff9345e37b81bb2fdf2ac47033))
* **deps:** update dependency @tailwindcss/forms to v0.5.7 ([a1500e0](https://github.com/icoretech/airbroke/commit/a1500e03fdc30578781328cea90e236ea0bb353b))
* **deps:** update dependency autoprefixer to v10.4.17 ([c67f870](https://github.com/icoretech/airbroke/commit/c67f8706a40a3fa5f24bbbf20bb5f4ab7d873f75))
* **deps:** update dependency chart.js to v4.4.1 ([8a59317](https://github.com/icoretech/airbroke/commit/8a5931797dbe249888486d16da7d17fd539ee961))
* **deps:** update dependency nanoid to v5.0.2 ([aa1da64](https://github.com/icoretech/airbroke/commit/aa1da6489696f04fac982195997449a4d66d2a4b))
* **deps:** update dependency nanoid to v5.0.3 ([cecc1f8](https://github.com/icoretech/airbroke/commit/cecc1f860f85bb273b067d42703e3d678b0c82ae))
* **deps:** update dependency nanoid to v5.0.4 ([c9e18d8](https://github.com/icoretech/airbroke/commit/c9e18d80858799f594d0a26b1e4ffaa43342b50b))
* **deps:** update dependency nanoid to v5.0.5 ([1f9d184](https://github.com/icoretech/airbroke/commit/1f9d18443bbab47a2d2d54ed3d4c5764e6cb1031))
* **deps:** update dependency next-auth to v4.23.2 ([ad5bfc3](https://github.com/icoretech/airbroke/commit/ad5bfc304913c2fd9c2b9d2e4a08a38ddcfcea9c))
* **deps:** update dependency next-auth to v4.24.3 ([0f13ab7](https://github.com/icoretech/airbroke/commit/0f13ab77413085a466a5599d199fb7d0bb5480c7))
* **deps:** update dependency next-auth to v4.24.4 ([4f6830c](https://github.com/icoretech/airbroke/commit/4f6830c3bc77734898cf59566dffffe55cabce8a))
* **deps:** update dependency next-auth to v4.24.5 ([6dd9ca3](https://github.com/icoretech/airbroke/commit/6dd9ca370ac7aa657ac211050436dd8c2a7060d0))
* **deps:** update dependency octokit to v3.1.1 ([c648309](https://github.com/icoretech/airbroke/commit/c648309215407643b2ac8b677ab2f51865fe9bb9))
* **deps:** update dependency octokit to v3.1.2 ([9b6d9a6](https://github.com/icoretech/airbroke/commit/9b6d9a6f15b8e4ddbcc88e3ef76eabacd8753778))
* **deps:** update dependency postcss to v8.4.31 ([c1a9676](https://github.com/icoretech/airbroke/commit/c1a9676957d2fe90c846b11ac1b6a3f92f112329))
* **deps:** update dependency postcss to v8.4.32 ([0b824f3](https://github.com/icoretech/airbroke/commit/0b824f3284b55c8dd7e3b6c4223ed945757763c5))
* **deps:** update dependency postcss to v8.4.33 ([2094c3a](https://github.com/icoretech/airbroke/commit/2094c3a7f0a8040e368b057298b6fcaff27d12ec))
* **deps:** update dependency postcss to v8.4.34 ([ccbe08a](https://github.com/icoretech/airbroke/commit/ccbe08a6f7a851e2c3a139bdc4646db0be631844))
* **deps:** update dependency postcss to v8.4.35 ([03a29ef](https://github.com/icoretech/airbroke/commit/03a29ef2b0bc3b9555d865bab89096fc5c68759a))
* **deps:** update dependency sharp to v0.33.0 ([7c4118e](https://github.com/icoretech/airbroke/commit/7c4118e27c9e2c8914d30157ab126e424afe6586))
* **deps:** update dependency sharp to v0.33.2 ([6b44cfd](https://github.com/icoretech/airbroke/commit/6b44cfd4c587bc93360459850132f9a76e01a760))
* **deps:** update dependency superjson to v1.13.3 ([2678fbc](https://github.com/icoretech/airbroke/commit/2678fbc4e50839bb4d6f2fd897d58ee215899577))
* **deps:** update dependency tailwindcss to v3.3.4 ([d38d4d3](https://github.com/icoretech/airbroke/commit/d38d4d37f325e7b86fd540cbd627d7240c2299c5))
* **deps:** update dependency tailwindcss to v3.3.5 ([0904573](https://github.com/icoretech/airbroke/commit/09045737755651b3b642b2e9a175f5c299de378a))
* **deps:** update dependency tailwindcss to v3.3.6 ([600d060](https://github.com/icoretech/airbroke/commit/600d060f916d3e9e573297258363bfbf76139172))
* **deps:** update dependency tailwindcss to v3.4.1 ([e2bca53](https://github.com/icoretech/airbroke/commit/e2bca537282582fdf0b42ec394406bdeb97da2b2))
* **deps:** update dependency typescript to v5.3.2 ([62e46a9](https://github.com/icoretech/airbroke/commit/62e46a98ed22ccb3273defa0cc3042fb591026f5))
* **deps:** update dependency typescript to v5.3.3 ([bdc7258](https://github.com/icoretech/airbroke/commit/bdc72581bc246c6e84d21cf8444e71f2a5b59311))
* **deps:** update dependency zod to v3.22.3 ([99d1f11](https://github.com/icoretech/airbroke/commit/99d1f116328629feff6a202e06de3f4c0642e055))
* **deps:** update dependency zod to v3.22.4 ([09ab904](https://github.com/icoretech/airbroke/commit/09ab9040201d0b99118f4bfb3815fa4082311912))
* **deps:** update dependency zod-form-data to v2.0.2 ([9a59acf](https://github.com/icoretech/airbroke/commit/9a59acf245c7c945dd4a277862d9eaae28fc8bf2))
* **deps:** update prisma monorepo to v5.4.1 ([259f1e5](https://github.com/icoretech/airbroke/commit/259f1e50771809115462a0597485bfe6ecfa24c9))
* **deps:** update prisma monorepo to v5.4.2 ([4830b79](https://github.com/icoretech/airbroke/commit/4830b799f1fd28b51611fd7a93f68d1c3959ac99))
* **deps:** update prisma monorepo to v5.5.0 ([d5918d2](https://github.com/icoretech/airbroke/commit/d5918d220545d3ae91bdc3080a3e6525969b681b))
* **deps:** update prisma monorepo to v5.5.2 ([11596a6](https://github.com/icoretech/airbroke/commit/11596a6c85cee4c265e3036cc1b306037c90ab08))
* **deps:** update prisma monorepo to v5.6.0 ([def53fc](https://github.com/icoretech/airbroke/commit/def53fc670d467e2c2dec2302044f2ae53633b74))
* **deps:** update prisma monorepo to v5.8.1 ([0db36cd](https://github.com/icoretech/airbroke/commit/0db36cd2a647d454c28c2cabddfc8469d7e5ffbd))
* **deps:** update prisma monorepo to v5.9.0 ([60ea80e](https://github.com/icoretech/airbroke/commit/60ea80e66341e68da0bbde40b60b407a78bf5130))
* **deps:** update prisma monorepo to v5.9.1 ([dbab0ec](https://github.com/icoretech/airbroke/commit/dbab0ecf230023d908a91e75ccc5591a7fa122e5))

## [1.1.51](https://github.com/icoretech/airbroke/compare/v1.1.50...v1.1.51) (2023-09-23)


### Bug Fixes

* **deps:** update dependency ai to v2.2.12 ([be8fc98](https://github.com/icoretech/airbroke/commit/be8fc98e72c6b34e6695c7e9de1e2169514d6d92))
* **deps:** update dependency ai to v2.2.13 ([8756ab9](https://github.com/icoretech/airbroke/commit/8756ab91660c81326b123794ffb36fd23139ce08))
* **deps:** update dependency autoprefixer to v10.4.16 ([0beba52](https://github.com/icoretech/airbroke/commit/0beba5258cb8a5cce4202852defb60da7cb31c48))
* **deps:** update dependency nanoid to v5 ([#279](https://github.com/icoretech/airbroke/issues/279)) ([ae5114e](https://github.com/icoretech/airbroke/commit/ae5114e13d13c1bd9af57558daed74d426614135))
* **deps:** update dependency postcss to v8.4.30 ([3000ca3](https://github.com/icoretech/airbroke/commit/3000ca34aadf9235d4844f928d9cd1cc5de694f9))
* **deps:** update dependency sharp to v0.32.6 ([ffe1803](https://github.com/icoretech/airbroke/commit/ffe1803777d097ba36a796fd3110e478948fac34))
* **deps:** update prisma monorepo to v5.3.0 ([f039779](https://github.com/icoretech/airbroke/commit/f0397790a038bdf00d246ec2431c35c0c3a1c70d))
* **deps:** update prisma monorepo to v5.3.1 ([7f38fd1](https://github.com/icoretech/airbroke/commit/7f38fd18c74f5d51af2e409d120aa4cdc50fa2be))

## [1.1.50](https://github.com/icoretech/airbroke/compare/v1.1.49...v1.1.50) (2023-09-04)


### Bug Fixes

* **deps:** update dependency @tailwindcss/forms to v0.5.5 ([18ad385](https://github.com/icoretech/airbroke/commit/18ad38531df7fb7e3a78323aa7454ae9119d9a4d))
* **deps:** update dependency @tailwindcss/forms to v0.5.6 ([19bcae0](https://github.com/icoretech/airbroke/commit/19bcae047214e574a67053e2011f5adcf3f58633))
* **deps:** update dependency ai to v2.2.10 ([a543fd9](https://github.com/icoretech/airbroke/commit/a543fd9002864ff0b4998a2d51f38ecf7b1fb3b6))
* **deps:** update dependency ai to v2.2.11 ([5bee61f](https://github.com/icoretech/airbroke/commit/5bee61f426162ab6d2c3e62960668d6ab12632ad))
* **deps:** update dependency ai to v2.2.7 ([e08b410](https://github.com/icoretech/airbroke/commit/e08b4101ab080bf74cc58a2c9ff85a5c6123cb0d))
* **deps:** update dependency ai to v2.2.8 ([db0a1f2](https://github.com/icoretech/airbroke/commit/db0a1f223ad156798f58bca3b8bd82f930a86e8c))
* **deps:** update dependency ai to v2.2.9 ([dd9dca6](https://github.com/icoretech/airbroke/commit/dd9dca65bb253121ee2a3f28c288546272ea9dd5))
* **deps:** update dependency chart.js to v4.4.0 ([4f408bf](https://github.com/icoretech/airbroke/commit/4f408bf704752cf5162b942349c90c75ad4ad85e))
* **deps:** update dependency postcss to v8.4.29 ([eb86262](https://github.com/icoretech/airbroke/commit/eb86262c9f739874c2fa6399bdec30b47e27b73b))
* **deps:** update dependency typescript to v5.2.2 ([ec98439](https://github.com/icoretech/airbroke/commit/ec9843950f70a8685feeab80c3961ba46acc27fb))
* **deps:** update prisma monorepo to v5.2.0 ([7a3d33d](https://github.com/icoretech/airbroke/commit/7a3d33dff439fede96f19b2b5340c176bce08dcb))

## [1.1.49](https://github.com/icoretech/airbroke/compare/v1.1.48...v1.1.49) (2023-08-19)


### Bug Fixes

* **Background.tsx:** update fill attribute to use the simplified pattern id for better semantics ([fd0e6a5](https://github.com/icoretech/airbroke/commit/fd0e6a58fb26d81065aa936699e65f6907114264))

## [1.1.48](https://github.com/icoretech/airbroke/compare/v1.1.47...v1.1.48) (2023-08-19)


### Bug Fixes

* **deps:** update dependency @headlessui/react to v1.7.17 ([51f03cc](https://github.com/icoretech/airbroke/commit/51f03cc172667e3083c59a8f0a9ad1ae3b6f9957))
* **deps:** update dependency ai to v2.2.2 ([#221](https://github.com/icoretech/airbroke/issues/221)) ([ace664b](https://github.com/icoretech/airbroke/commit/ace664bfc2ab27e2a98b5f20ceb554c766193c89))
* **deps:** update dependency ai to v2.2.6 ([43e5f6b](https://github.com/icoretech/airbroke/commit/43e5f6b0c4053c41a160a1e80f978cdd4eeb82f4))
* **deps:** update dependency zod to v3.22.2 ([#229](https://github.com/icoretech/airbroke/issues/229)) ([a043ea9](https://github.com/icoretech/airbroke/commit/a043ea90ea35a321d0dcef22711a8f34ece256cf))

## [1.1.47](https://github.com/icoretech/airbroke/compare/v1.1.46...v1.1.47) (2023-08-17)


### Features

* **route.ts:** update OpenAI initialization to use the new OpenAI constructor and include organization parameter if available ([e68163c](https://github.com/icoretech/airbroke/commit/e68163cd0e10826c71f7002a1f1b972dcac5c127))


### Bug Fixes

* **Breadcrumbs.tsx:** add Projects link to breadcrumbs for easier navigation ([f6e6797](https://github.com/icoretech/airbroke/commit/f6e6797e0cb6cab71d414ac273c275b9b209a507))
* **deps:** update dependency ai to v2.1.34 ([b5a4cce](https://github.com/icoretech/airbroke/commit/b5a4cce8385745588c108d4122cf86db0e3ee8b9))
* **deps:** update dependency next-auth to v4.23.1 ([bff1e15](https://github.com/icoretech/airbroke/commit/bff1e1506b6e245c87786f8a93ef083c856ac4af))
* **deps:** update dependency postcss to v8.4.28 ([#216](https://github.com/icoretech/airbroke/issues/216)) ([659e306](https://github.com/icoretech/airbroke/commit/659e30642b759ad7a4361972bf641baf90cb6548))
* **deps:** update dependency sharp to v0.32.5 ([#217](https://github.com/icoretech/airbroke/issues/217)) ([8bf2a49](https://github.com/icoretech/airbroke/commit/8bf2a491d06f1053ff1764e9bda70277297a3d52))
* **deps:** update dependency zod to v3.22.0 ([3a8781a](https://github.com/icoretech/airbroke/commit/3a8781a057e1deef522f4566344da82d3e47afc1))
* **deps:** update dependency zod to v3.22.1 ([#218](https://github.com/icoretech/airbroke/issues/218)) ([5ddc22b](https://github.com/icoretech/airbroke/commit/5ddc22b471e4fc2012c1c025c1f6a717987d4b80))
* **package.json:** update ai package version to 2.2.1 for compatibility and bug fixes ([e68163c](https://github.com/icoretech/airbroke/commit/e68163cd0e10826c71f7002a1f1b972dcac5c127))
* **page.tsx:** reorganize JSX structure for better readability and maintainability ([f6e6797](https://github.com/icoretech/airbroke/commit/f6e6797e0cb6cab71d414ac273c275b9b209a507))
* **route.ts:** update import statement for OpenAI library to use the correct package name ([e68163c](https://github.com/icoretech/airbroke/commit/e68163cd0e10826c71f7002a1f1b972dcac5c127))
* **route.ts:** update method name for creating chat completions from createChatCompletion to chat.completions.create ([e68163c](https://github.com/icoretech/airbroke/commit/e68163cd0e10826c71f7002a1f1b972dcac5c127))
* **SidebarButtons.tsx:** update styling and icon for SidebarOpenButton ([f6e6797](https://github.com/icoretech/airbroke/commit/f6e6797e0cb6cab71d414ac273c275b9b209a507))

## [1.1.46](https://github.com/icoretech/airbroke/compare/v1.1.45...v1.1.46) (2023-08-14)


### Features

* **package.json:** add 'npm-check-updates' as a new dev dependency to manage package updates ([486043d](https://github.com/icoretech/airbroke/commit/486043d6e17d7ce5c75ab307c91e56ebbdb28d8e))


### Bug Fixes

* **deps:** update dependency ai to v2.1.33 ([d9e258c](https://github.com/icoretech/airbroke/commit/d9e258cc7100835789b0784d1ea7d5d4598e7b81))
* **deps:** update dependency autoprefixer to v10.4.15 ([13a4c76](https://github.com/icoretech/airbroke/commit/13a4c766a9bb562f71e8ba9d1948cfbf39c0f57b))
* **deps:** update dependency next-auth to v4.23.0 ([97bc9a8](https://github.com/icoretech/airbroke/commit/97bc9a8be748ce958a50c3488fbd2eff850c5b58))
* **deps:** update dependency react-icons-ng to v4.9.1 ([bbf05e6](https://github.com/icoretech/airbroke/commit/bbf05e6a67135879f610cccfdd255f9142712c12))
* **SidebarMobile.tsx:** use tailwind class ([d9df921](https://github.com/icoretech/airbroke/commit/d9df921a39b7d85c2b0841eb8c57a55b927b07ee))

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
