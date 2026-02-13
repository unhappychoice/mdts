# Changelog

## v0.16.1

### ✨ Features
- automate CHANGELOG generation with release workflow integration ([b555a40](https://github.com/unhappychoice/mdts/commit/b555a40)) ([#511](https://github.com/unhappychoice/mdts/pull/511))

### 🐛 Bug Fixes
- prevent code blocks from overflowing content area in full mode ([be0bd94](https://github.com/unhappychoice/mdts/commit/be0bd94)) ([#532](https://github.com/unhappychoice/mdts/pull/532))

### 🆙 Update Packages
- Bump @mui/icons-material in /packages/frontend ([931af44](https://github.com/unhappychoice/mdts/commit/931af44)) ([#529](https://github.com/unhappychoice/mdts/pull/529))
- Bump webpack in /packages/frontend ([5dc2ff7](https://github.com/unhappychoice/mdts/commit/5dc2ff7)) ([#531](https://github.com/unhappychoice/mdts/pull/531))
- Bump eslint-plugin-jest in /packages/frontend ([d517236](https://github.com/unhappychoice/mdts/commit/d517236)) ([#530](https://github.com/unhappychoice/mdts/pull/530))
- Bump glob from 13.0.2 to 13.0.3 ([cd419dc](https://github.com/unhappychoice/mdts/commit/cd419dc)) ([#528](https://github.com/unhappychoice/mdts/pull/528))
- Bump @mui/material in /packages/frontend ([4780469](https://github.com/unhappychoice/mdts/commit/4780469)) ([#527](https://github.com/unhappychoice/mdts/pull/527))
- Bump webpack in /packages/frontend ([1a6c3ec](https://github.com/unhappychoice/mdts/commit/1a6c3ec)) ([#526](https://github.com/unhappychoice/mdts/pull/526))
- Bump markdown-it from 14.1.0 to 14.1.1 ([0968263](https://github.com/unhappychoice/mdts/commit/0968263)) ([#525](https://github.com/unhappychoice/mdts/pull/525))
- Bump glob from 13.0.1 to 13.0.2 ([28e7246](https://github.com/unhappychoice/mdts/commit/28e7246)) ([#524](https://github.com/unhappychoice/mdts/pull/524))
- Bump @stylistic/eslint-plugin in /packages/frontend (#523) ([292a3ed](https://github.com/unhappychoice/mdts/commit/292a3ed))
- Bump @typescript-eslint/parser from 8.54.0 to 8.55.0 (#521) ([fc8c189](https://github.com/unhappychoice/mdts/commit/fc8c189))
- Bump @typescript-eslint/parser in /packages/frontend (#517) ([401849a](https://github.com/unhappychoice/mdts/commit/401849a))
- Bump typescript-eslint from 8.54.0 to 8.55.0 (#516) ([9c5bafa](https://github.com/unhappychoice/mdts/commit/9c5bafa))
- Bump typescript-eslint in /packages/frontend (#515) ([996b29d](https://github.com/unhappychoice/mdts/commit/996b29d))
- Bump @stylistic/eslint-plugin from 5.7.1 to 5.8.0 (#514) ([14a9e00](https://github.com/unhappychoice/mdts/commit/14a9e00))
- Bump axios from 1.13.4 to 1.13.5 ([bf78248](https://github.com/unhappychoice/mdts/commit/bf78248)) ([#513](https://github.com/unhappychoice/mdts/pull/513))
- Bump eslint-plugin-jest in /packages/frontend ([4c92d51](https://github.com/unhappychoice/mdts/commit/4c92d51)) ([#512](https://github.com/unhappychoice/mdts/pull/512))

### 💚 CI/Test
- update snapshots for minWidth: 0 style change ([f65cef5](https://github.com/unhappychoice/mdts/commit/f65cef5)) ([#532](https://github.com/unhappychoice/mdts/pull/532))


## v0.16.0

### ✨ Features
- support glob patterns and specific file lists as arguments ([d45d674](https://github.com/unhappychoice/mdts/commit/d45d674)) ([#510](https://github.com/unhappychoice/mdts/pull/510))
- add remark-breaks support with config option ([eda775e](https://github.com/unhappychoice/mdts/commit/eda775e)) ([#509](https://github.com/unhappychoice/mdts/pull/509))

### 🐛 Bug Fixes
- resolve lint errors in watcher, glob test, and watcher test ([13f1515](https://github.com/unhappychoice/mdts/commit/13f1515)) ([#510](https://github.com/unhappychoice/mdts/pull/510))
- add jest-util to resolve ts-jest compatibility ([6cf133e](https://github.com/unhappychoice/mdts/commit/6cf133e)) ([#459](https://github.com/unhappychoice/mdts/pull/459))
- add jest-util to resolve ts-jest compatibility ([4436bb9](https://github.com/unhappychoice/mdts/commit/4436bb9)) ([#461](https://github.com/unhappychoice/mdts/pull/461))

### 📝 Documentation
- use parentheses to clarify mdts acronym in README ([40953c5](https://github.com/unhappychoice/mdts/commit/40953c5))
- add mdts acronym (Markdown Tree Server) to README ([2cb4ce9](https://github.com/unhappychoice/mdts/commit/2cb4ce9))
- add --glob option documentation to README, CLI help, and guides ([9998b4b](https://github.com/unhappychoice/mdts/commit/9998b4b)) ([#510](https://github.com/unhappychoice/mdts/pull/510))

### ♻️ Refactor
- address CodeRabbit review and restore missing docs ([d444da4](https://github.com/unhappychoice/mdts/commit/d444da4)) ([#510](https://github.com/unhappychoice/mdts/pull/510))
- use explicit --glob option instead of heuristic argument detection ([eb0d897](https://github.com/unhappychoice/mdts/commit/eb0d897)) ([#510](https://github.com/unhappychoice/mdts/pull/510))
- address CodeRabbit review feedback ([ea8653b](https://github.com/unhappychoice/mdts/commit/ea8653b)) ([#510](https://github.com/unhappychoice/mdts/pull/510))

### 🆙 Update Packages
- Bump webpack in /packages/frontend ([7632724](https://github.com/unhappychoice/mdts/commit/7632724)) ([#508](https://github.com/unhappychoice/mdts/pull/508))
- Bump @eslint/compat in /packages/frontend ([aa41ab2](https://github.com/unhappychoice/mdts/commit/aa41ab2)) ([#507](https://github.com/unhappychoice/mdts/pull/507))
- Bump eslint-plugin-jest in /packages/frontend ([f7ffdef](https://github.com/unhappychoice/mdts/commit/f7ffdef)) ([#506](https://github.com/unhappychoice/mdts/pull/506))
- Bump @mui/x-tree-view in /packages/frontend ([1226b40](https://github.com/unhappychoice/mdts/commit/1226b40)) ([#505](https://github.com/unhappychoice/mdts/pull/505))
- Bump @babel/preset-env in /packages/frontend ([ff5e931](https://github.com/unhappychoice/mdts/commit/ff5e931)) ([#503](https://github.com/unhappychoice/mdts/pull/503))
- Bump @babel/core in /packages/frontend ([6408368](https://github.com/unhappychoice/mdts/commit/6408368)) ([#504](https://github.com/unhappychoice/mdts/pull/504))
- Bump commander from 14.0.2 to 14.0.3 ([ad8d3d8](https://github.com/unhappychoice/mdts/commit/ad8d3d8)) ([#502](https://github.com/unhappychoice/mdts/pull/502))
- Bump css-loader in /packages/frontend ([4f07878](https://github.com/unhappychoice/mdts/commit/4f07878)) ([#500](https://github.com/unhappychoice/mdts/pull/500))
- Bump axios from 1.13.3 to 1.13.4 ([fdafae0](https://github.com/unhappychoice/mdts/commit/fdafae0)) ([#498](https://github.com/unhappychoice/mdts/pull/498))
- Bump typescript-eslint in /packages/frontend ([ab9989e](https://github.com/unhappychoice/mdts/commit/ab9989e)) ([#497](https://github.com/unhappychoice/mdts/pull/497))
- Bump @mui/x-tree-view in /packages/frontend ([26fad89](https://github.com/unhappychoice/mdts/commit/26fad89)) ([#485](https://github.com/unhappychoice/mdts/pull/485))
- Bump typescript-eslint from 8.53.1 to 8.54.0 ([fe3b9d6](https://github.com/unhappychoice/mdts/commit/fe3b9d6)) ([#492](https://github.com/unhappychoice/mdts/pull/492))
- Bump react-router-dom in /packages/frontend ([0fee720](https://github.com/unhappychoice/mdts/commit/0fee720)) ([#489](https://github.com/unhappychoice/mdts/pull/489))
- Bump @typescript-eslint/parser in /packages/frontend ([5751be1](https://github.com/unhappychoice/mdts/commit/5751be1)) ([#495](https://github.com/unhappychoice/mdts/pull/495))
- Bump @typescript-eslint/parser from 8.53.1 to 8.54.0 ([c23d29c](https://github.com/unhappychoice/mdts/commit/c23d29c)) ([#493](https://github.com/unhappychoice/mdts/pull/493))
- Bump react-dom from 19.2.3 to 19.2.4 in /packages/frontend ([eed09a0](https://github.com/unhappychoice/mdts/commit/eed09a0)) ([#494](https://github.com/unhappychoice/mdts/pull/494))
- Bump @stylistic/eslint-plugin in /packages/frontend ([3b4a3f4](https://github.com/unhappychoice/mdts/commit/3b4a3f4)) ([#491](https://github.com/unhappychoice/mdts/pull/491))
- Bump axios from 1.13.2 to 1.13.3 ([ea090f0](https://github.com/unhappychoice/mdts/commit/ea090f0)) ([#490](https://github.com/unhappychoice/mdts/pull/490))
- Bump @stylistic/eslint-plugin from 5.7.0 to 5.7.1 ([c92d82d](https://github.com/unhappychoice/mdts/commit/c92d82d)) ([#488](https://github.com/unhappychoice/mdts/pull/488))
- Bump typescript-eslint in /packages/frontend ([bfa8aa5](https://github.com/unhappychoice/mdts/commit/bfa8aa5)) ([#483](https://github.com/unhappychoice/mdts/pull/483))
- Bump @types/aws-lambda from 8.10.159 to 8.10.160 ([49c2d64](https://github.com/unhappychoice/mdts/commit/49c2d64)) ([#481](https://github.com/unhappychoice/mdts/pull/481))
- Bump @typescript-eslint/parser from 8.53.0 to 8.53.1 ([0e6e2fb](https://github.com/unhappychoice/mdts/commit/0e6e2fb)) ([#480](https://github.com/unhappychoice/mdts/pull/480))
- Bump html-webpack-plugin in /packages/frontend ([a812293](https://github.com/unhappychoice/mdts/commit/a812293)) ([#479](https://github.com/unhappychoice/mdts/pull/479))
- Bump @typescript-eslint/parser in /packages/frontend ([3a8d342](https://github.com/unhappychoice/mdts/commit/3a8d342)) ([#477](https://github.com/unhappychoice/mdts/pull/477))
- Bump typescript-eslint from 8.53.0 to 8.53.1 ([9988074](https://github.com/unhappychoice/mdts/commit/9988074)) ([#476](https://github.com/unhappychoice/mdts/pull/476))
- Bump @testing-library/react in /packages/frontend ([6c46023](https://github.com/unhappychoice/mdts/commit/6c46023)) ([#475](https://github.com/unhappychoice/mdts/pull/475))
- Bump @babel/core in /packages/frontend ([ad6cf91](https://github.com/unhappychoice/mdts/commit/ad6cf91)) ([#470](https://github.com/unhappychoice/mdts/pull/470))
- Bump @eslint/compat in /packages/frontend ([9436e1d](https://github.com/unhappychoice/mdts/commit/9436e1d)) ([#468](https://github.com/unhappychoice/mdts/pull/468))
- Bump @stylistic/eslint-plugin in /packages/frontend ([599915e](https://github.com/unhappychoice/mdts/commit/599915e)) ([#474](https://github.com/unhappychoice/mdts/pull/474))
- Bump @babel/preset-env in /packages/frontend ([046e631](https://github.com/unhappychoice/mdts/commit/046e631)) ([#473](https://github.com/unhappychoice/mdts/pull/473))
- Bump @mui/x-tree-view in /packages/frontend ([a561d3e](https://github.com/unhappychoice/mdts/commit/a561d3e)) ([#472](https://github.com/unhappychoice/mdts/pull/472))
- Bump supertest from 7.1.4 to 7.2.2 ([ccb40c7](https://github.com/unhappychoice/mdts/commit/ccb40c7)) ([#471](https://github.com/unhappychoice/mdts/pull/471))
- Bump @stylistic/eslint-plugin from 5.6.1 to 5.7.0 ([9ec959f](https://github.com/unhappychoice/mdts/commit/9ec959f)) ([#469](https://github.com/unhappychoice/mdts/pull/469))
- Bump typescript-eslint from 8.51.0 to 8.52.0 ([f398c12](https://github.com/unhappychoice/mdts/commit/f398c12)) ([#457](https://github.com/unhappychoice/mdts/pull/457))
- Bump @typescript-eslint/eslint-plugin ([e7da255](https://github.com/unhappychoice/mdts/commit/e7da255)) ([#463](https://github.com/unhappychoice/mdts/pull/463))
- Bump ws from 8.18.3 to 8.19.0 ([65d8533](https://github.com/unhappychoice/mdts/commit/65d8533)) ([#459](https://github.com/unhappychoice/mdts/pull/459))
- Bump @typescript-eslint/parser from 8.51.0 to 8.52.0 ([5f45ad7](https://github.com/unhappychoice/mdts/commit/5f45ad7)) ([#461](https://github.com/unhappychoice/mdts/pull/461))
- Bump typescript-eslint in /packages/frontend ([8ee03c3](https://github.com/unhappychoice/mdts/commit/8ee03c3)) ([#462](https://github.com/unhappychoice/mdts/pull/462))
- Bump @mui/icons-material in /packages/frontend ([67f64c8](https://github.com/unhappychoice/mdts/commit/67f64c8)) ([#466](https://github.com/unhappychoice/mdts/pull/466))
- Bump @mui/material in /packages/frontend ([cc2fe1b](https://github.com/unhappychoice/mdts/commit/cc2fe1b)) ([#467](https://github.com/unhappychoice/mdts/pull/467))
- Bump react-router-dom in /packages/frontend ([69d0c1f](https://github.com/unhappychoice/mdts/commit/69d0c1f)) ([#465](https://github.com/unhappychoice/mdts/pull/465))
- Bump eslint-plugin-jest in /packages/frontend ([aa53b78](https://github.com/unhappychoice/mdts/commit/aa53b78)) ([#456](https://github.com/unhappychoice/mdts/pull/456))

## v0.15.0

### ✨ Features
- add --no-open flag to disable auto-opening browser ([317dea6](https://github.com/unhappychoice/mdts/commit/317dea6)) ([#454](https://github.com/unhappychoice/mdts/pull/454))

### 🐛 Bug Fixes
- use npx npm@11.5.1 for trusted publishing ([bf8b7fe](https://github.com/unhappychoice/mdts/commit/bf8b7fe))
- use setup-node@v6 with Node.js 24 for trusted publishing ([f620d35](https://github.com/unhappychoice/mdts/commit/f620d35))
- update npm to latest for trusted publishing ([e61a898](https://github.com/unhappychoice/mdts/commit/e61a898))
- resolve jest configuration warnings and test failures ([81ea97f](https://github.com/unhappychoice/mdts/commit/81ea97f)) ([#253](https://github.com/unhappychoice/mdts/pull/253))

### 🆙 Update Packages
- Bump typescript-eslint from 8.50.1 to 8.51.0 ([026e786](https://github.com/unhappychoice/mdts/commit/026e786)) ([#451](https://github.com/unhappychoice/mdts/pull/451))
- Bump eslint-plugin-jest in /packages/frontend ([f24da58](https://github.com/unhappychoice/mdts/commit/f24da58)) ([#452](https://github.com/unhappychoice/mdts/pull/452))
- Bump typescript-eslint in /packages/frontend ([59daa00](https://github.com/unhappychoice/mdts/commit/59daa00)) ([#450](https://github.com/unhappychoice/mdts/pull/450))
- Bump @typescript-eslint/eslint-plugin ([ee923f9](https://github.com/unhappychoice/mdts/commit/ee923f9)) ([#446](https://github.com/unhappychoice/mdts/pull/446))
- Bump @typescript-eslint/parser in /packages/frontend ([3a510e5](https://github.com/unhappychoice/mdts/commit/3a510e5)) ([#445](https://github.com/unhappychoice/mdts/pull/445))
- Bump eslint-plugin-jest in /packages/frontend ([4b0ce13](https://github.com/unhappychoice/mdts/commit/4b0ce13)) ([#444](https://github.com/unhappychoice/mdts/pull/444))
- Bump typescript-eslint in /packages/frontend ([9e53d8c](https://github.com/unhappychoice/mdts/commit/9e53d8c)) ([#438](https://github.com/unhappychoice/mdts/pull/438))
- Bump @typescript-eslint/eslint-plugin ([8cc13af](https://github.com/unhappychoice/mdts/commit/8cc13af)) ([#435](https://github.com/unhappychoice/mdts/pull/435))
- Bump @mui/x-tree-view in /packages/frontend ([c273f2a](https://github.com/unhappychoice/mdts/commit/c273f2a)) ([#443](https://github.com/unhappychoice/mdts/pull/443))
- Bump eslint-plugin-jest in /packages/frontend ([eb36059](https://github.com/unhappychoice/mdts/commit/eb36059)) ([#442](https://github.com/unhappychoice/mdts/pull/442))
- Bump @typescript-eslint/parser in /packages/frontend ([fbcdd86](https://github.com/unhappychoice/mdts/commit/fbcdd86)) ([#440](https://github.com/unhappychoice/mdts/pull/440))
- Bump @typescript-eslint/parser from 8.50.0 to 8.50.1 ([9ece055](https://github.com/unhappychoice/mdts/commit/9ece055)) ([#439](https://github.com/unhappychoice/mdts/pull/439))
- Bump typescript-eslint from 8.50.0 to 8.50.1 ([35f8572](https://github.com/unhappychoice/mdts/commit/35f8572)) ([#436](https://github.com/unhappychoice/mdts/pull/436))
- Bump eslint-plugin-jest in /packages/frontend ([095f3a9](https://github.com/unhappychoice/mdts/commit/095f3a9)) ([#434](https://github.com/unhappychoice/mdts/pull/434))
- Bump webpack in /packages/frontend ([6c7ed85](https://github.com/unhappychoice/mdts/commit/6c7ed85)) ([#433](https://github.com/unhappychoice/mdts/pull/433))
- Bump react-router-dom in /packages/frontend ([019540f](https://github.com/unhappychoice/mdts/commit/019540f)) ([#432](https://github.com/unhappychoice/mdts/pull/432))
- Bump webpack in /packages/frontend ([c80c081](https://github.com/unhappychoice/mdts/commit/c80c081)) ([#431](https://github.com/unhappychoice/mdts/pull/431))
- Bump @testing-library/react in /packages/frontend ([9e21d5b](https://github.com/unhappychoice/mdts/commit/9e21d5b)) ([#430](https://github.com/unhappychoice/mdts/pull/430))
- Bump eslint from 9.39.1 to 9.39.2 ([c52b155](https://github.com/unhappychoice/mdts/commit/c52b155)) ([#424](https://github.com/unhappychoice/mdts/pull/424))
- Bump typescript-eslint from 8.49.0 to 8.50.0 ([e7ebf3d](https://github.com/unhappychoice/mdts/commit/e7ebf3d)) ([#428](https://github.com/unhappychoice/mdts/pull/428))
- Bump @typescript-eslint/parser from 8.49.0 to 8.50.0 ([292fb87](https://github.com/unhappychoice/mdts/commit/292fb87)) ([#429](https://github.com/unhappychoice/mdts/pull/429))
- Bump typescript-eslint in /packages/frontend ([d135c4d](https://github.com/unhappychoice/mdts/commit/d135c4d)) ([#426](https://github.com/unhappychoice/mdts/pull/426))
- Bump eslint-plugin-jest in /packages/frontend ([46f3cb2](https://github.com/unhappychoice/mdts/commit/46f3cb2)) ([#423](https://github.com/unhappychoice/mdts/pull/423))
- Bump eslint from 9.39.1 to 9.39.2 in /packages/frontend ([847776b](https://github.com/unhappychoice/mdts/commit/847776b)) ([#422](https://github.com/unhappychoice/mdts/pull/422))
- Bump @reduxjs/toolkit in /packages/frontend ([9555a90](https://github.com/unhappychoice/mdts/commit/9555a90)) ([#421](https://github.com/unhappychoice/mdts/pull/421))
- Bump react-dom from 19.2.1 to 19.2.3 in /packages/frontend ([560eb63](https://github.com/unhappychoice/mdts/commit/560eb63)) ([#420](https://github.com/unhappychoice/mdts/pull/420))
- Bump @mui/x-tree-view in /packages/frontend ([8ea15ea](https://github.com/unhappychoice/mdts/commit/8ea15ea)) ([#419](https://github.com/unhappychoice/mdts/pull/419))
- Bump typescript-eslint in /packages/frontend ([8cf4fcc](https://github.com/unhappychoice/mdts/commit/8cf4fcc)) ([#417](https://github.com/unhappychoice/mdts/pull/417))
- Bump @typescript-eslint/parser from 8.48.1 to 8.49.0 ([f418c44](https://github.com/unhappychoice/mdts/commit/f418c44)) ([#416](https://github.com/unhappychoice/mdts/pull/416))
- Bump @typescript-eslint/parser in /packages/frontend ([092237b](https://github.com/unhappychoice/mdts/commit/092237b)) ([#415](https://github.com/unhappychoice/mdts/pull/415))
- Bump typescript-eslint from 8.48.1 to 8.49.0 ([ba4f922](https://github.com/unhappychoice/mdts/commit/ba4f922)) ([#412](https://github.com/unhappychoice/mdts/pull/412))
- Bump @reduxjs/toolkit in /packages/frontend ([562dd3b](https://github.com/unhappychoice/mdts/commit/562dd3b)) ([#411](https://github.com/unhappychoice/mdts/pull/411))
- Bump react-router-dom in /packages/frontend ([9f63897](https://github.com/unhappychoice/mdts/commit/9f63897)) ([#410](https://github.com/unhappychoice/mdts/pull/410))
- Bump @mui/x-tree-view in /packages/frontend ([880dc7e](https://github.com/unhappychoice/mdts/commit/880dc7e)) ([#409](https://github.com/unhappychoice/mdts/pull/409))
- Bump typescript-eslint from 8.48.0 to 8.48.1 ([6a1b9c5](https://github.com/unhappychoice/mdts/commit/6a1b9c5)) ([#407](https://github.com/unhappychoice/mdts/pull/407))
- Bump react-dom from 19.2.0 to 19.2.1 in /packages/frontend ([b3d2d09](https://github.com/unhappychoice/mdts/commit/b3d2d09)) ([#406](https://github.com/unhappychoice/mdts/pull/406))
- Bump @typescript-eslint/eslint-plugin ([c5b44aa](https://github.com/unhappychoice/mdts/commit/c5b44aa)) ([#400](https://github.com/unhappychoice/mdts/pull/400))
- Bump typescript-eslint in /packages/frontend ([dc65ce7](https://github.com/unhappychoice/mdts/commit/dc65ce7)) ([#403](https://github.com/unhappychoice/mdts/pull/403))
- Bump @typescript-eslint/parser in /packages/frontend ([bb8bd29](https://github.com/unhappychoice/mdts/commit/bb8bd29)) ([#401](https://github.com/unhappychoice/mdts/pull/401))
- Bump @typescript-eslint/parser from 8.48.0 to 8.48.1 ([2460616](https://github.com/unhappychoice/mdts/commit/2460616)) ([#402](https://github.com/unhappychoice/mdts/pull/402))
- Bump mermaid from 11.12.1 to 11.12.2 in /packages/frontend ([a127f62](https://github.com/unhappychoice/mdts/commit/a127f62)) ([#405](https://github.com/unhappychoice/mdts/pull/405))
- Bump react-router-dom in /packages/frontend ([b0e0ba5](https://github.com/unhappychoice/mdts/commit/b0e0ba5)) ([#404](https://github.com/unhappychoice/mdts/pull/404))
- Bump @mui/icons-material in /packages/frontend ([f35de9a](https://github.com/unhappychoice/mdts/commit/f35de9a)) ([#399](https://github.com/unhappychoice/mdts/pull/399))
- Bump express and @types/express ([db3423b](https://github.com/unhappychoice/mdts/commit/db3423b)) ([#398](https://github.com/unhappychoice/mdts/pull/398))
- Bump ts-jest from 29.4.5 to 29.4.6 ([4ba897a](https://github.com/unhappychoice/mdts/commit/4ba897a)) ([#397](https://github.com/unhappychoice/mdts/pull/397))
- Bump typescript-eslint in /packages/frontend ([e4ec095](https://github.com/unhappychoice/mdts/commit/e4ec095)) ([#395](https://github.com/unhappychoice/mdts/pull/395))
- Bump @typescript-eslint/parser in /packages/frontend ([50bca73](https://github.com/unhappychoice/mdts/commit/50bca73)) ([#394](https://github.com/unhappychoice/mdts/pull/394))
- Bump @typescript-eslint/parser from 8.47.0 to 8.48.0 ([176ba6f](https://github.com/unhappychoice/mdts/commit/176ba6f)) ([#391](https://github.com/unhappychoice/mdts/pull/391))
- Bump typescript-eslint from 8.47.0 to 8.48.0 ([704eeb1](https://github.com/unhappychoice/mdts/commit/704eeb1)) ([#390](https://github.com/unhappychoice/mdts/pull/390))
- Bump @reduxjs/toolkit in /packages/frontend ([8c2f519](https://github.com/unhappychoice/mdts/commit/8c2f519)) ([#389](https://github.com/unhappychoice/mdts/pull/389))
- Bump eslint-plugin-jest in /packages/frontend ([5be6dfd](https://github.com/unhappychoice/mdts/commit/5be6dfd)) ([#388](https://github.com/unhappychoice/mdts/pull/388))
- Bump rehype-github-alerts in /packages/frontend ([034a87e](https://github.com/unhappychoice/mdts/commit/034a87e)) ([#387](https://github.com/unhappychoice/mdts/pull/387))
- Bump eslint-plugin-jest in /packages/frontend ([1c9be9f](https://github.com/unhappychoice/mdts/commit/1c9be9f)) ([#386](https://github.com/unhappychoice/mdts/pull/386))
- Bump @mui/x-tree-view in /packages/frontend ([b293a50](https://github.com/unhappychoice/mdts/commit/b293a50)) ([#385](https://github.com/unhappychoice/mdts/pull/385))
- Bump webpack in /packages/frontend ([d780d2d](https://github.com/unhappychoice/mdts/commit/d780d2d)) ([#384](https://github.com/unhappychoice/mdts/pull/384))
- Bump @stylistic/eslint-plugin in /packages/frontend ([e218fc4](https://github.com/unhappychoice/mdts/commit/e218fc4)) ([#383](https://github.com/unhappychoice/mdts/pull/383))
- Bump @types/aws-lambda from 8.10.158 to 8.10.159 ([8decc16](https://github.com/unhappychoice/mdts/commit/8decc16)) ([#382](https://github.com/unhappychoice/mdts/pull/382))
- Bump html-webpack-plugin in /packages/frontend ([3f72729](https://github.com/unhappychoice/mdts/commit/3f72729)) ([#381](https://github.com/unhappychoice/mdts/pull/381))
- Bump @stylistic/eslint-plugin from 5.5.0 to 5.6.1 ([ed366db](https://github.com/unhappychoice/mdts/commit/ed366db)) ([#380](https://github.com/unhappychoice/mdts/pull/380))
- Bump @mui/x-tree-view in /packages/frontend ([44127a2](https://github.com/unhappychoice/mdts/commit/44127a2)) ([#370](https://github.com/unhappychoice/mdts/pull/370))
- Bump open from 10.2.0 to 11.0.0 ([99f2322](https://github.com/unhappychoice/mdts/commit/99f2322)) ([#372](https://github.com/unhappychoice/mdts/pull/372))
- Bump typescript-eslint in /packages/frontend ([8de5fa5](https://github.com/unhappychoice/mdts/commit/8de5fa5)) ([#379](https://github.com/unhappychoice/mdts/pull/379))
- Bump typescript-eslint from 8.46.4 to 8.47.0 ([6e44616](https://github.com/unhappychoice/mdts/commit/6e44616)) ([#378](https://github.com/unhappychoice/mdts/pull/378))
- Bump @typescript-eslint/parser in /packages/frontend ([25d103c](https://github.com/unhappychoice/mdts/commit/25d103c)) ([#376](https://github.com/unhappychoice/mdts/pull/376))
- Bump @typescript-eslint/parser from 8.46.4 to 8.47.0 ([c0af7aa](https://github.com/unhappychoice/mdts/commit/c0af7aa)) ([#375](https://github.com/unhappychoice/mdts/pull/375))
- Bump @eslint/compat in /packages/frontend ([ef27844](https://github.com/unhappychoice/mdts/commit/ef27844)) ([#373](https://github.com/unhappychoice/mdts/pull/373))
- Bump react-router-dom in /packages/frontend ([50d50ce](https://github.com/unhappychoice/mdts/commit/50d50ce)) ([#371](https://github.com/unhappychoice/mdts/pull/371))
- Bump @types/aws-lambda from 8.10.157 to 8.10.158 ([ab10c92](https://github.com/unhappychoice/mdts/commit/ab10c92)) ([#369](https://github.com/unhappychoice/mdts/pull/369))
- Bump typescript-eslint from 8.46.3 to 8.46.4 ([7a99b84](https://github.com/unhappychoice/mdts/commit/7a99b84)) ([#367](https://github.com/unhappychoice/mdts/pull/367))
- Bump typescript-eslint in /packages/frontend ([be33619](https://github.com/unhappychoice/mdts/commit/be33619)) ([#366](https://github.com/unhappychoice/mdts/pull/366))
- Bump @typescript-eslint/parser in /packages/frontend ([a297a9d](https://github.com/unhappychoice/mdts/commit/a297a9d)) ([#364](https://github.com/unhappychoice/mdts/pull/364))
- Bump @typescript-eslint/parser from 8.46.3 to 8.46.4 ([a9b0242](https://github.com/unhappychoice/mdts/commit/a9b0242)) ([#363](https://github.com/unhappychoice/mdts/pull/363))
- Bump eslint-plugin-jest in /packages/frontend ([caf349c](https://github.com/unhappychoice/mdts/commit/caf349c)) ([#362](https://github.com/unhappychoice/mdts/pull/362))
- Bump @reduxjs/toolkit in /packages/frontend ([886d4f5](https://github.com/unhappychoice/mdts/commit/886d4f5)) ([#360](https://github.com/unhappychoice/mdts/pull/360))
- Bump @mui/icons-material in /packages/frontend ([812e053](https://github.com/unhappychoice/mdts/commit/812e053)) ([#358](https://github.com/unhappychoice/mdts/pull/358))
- Bump axios from 1.13.1 to 1.13.2 ([77fc6e8](https://github.com/unhappychoice/mdts/commit/77fc6e8)) ([#357](https://github.com/unhappychoice/mdts/pull/357))
- Bump typescript-eslint in /packages/frontend ([f8cee16](https://github.com/unhappychoice/mdts/commit/f8cee16)) ([#356](https://github.com/unhappychoice/mdts/pull/356))
- Bump @typescript-eslint/parser in /packages/frontend ([c9cd050](https://github.com/unhappychoice/mdts/commit/c9cd050)) ([#355](https://github.com/unhappychoice/mdts/pull/355))
- Bump eslint from 9.38.0 to 9.39.1 ([9199507](https://github.com/unhappychoice/mdts/commit/9199507)) ([#354](https://github.com/unhappychoice/mdts/pull/354))
- Bump @reduxjs/toolkit in /packages/frontend ([d2e77de](https://github.com/unhappychoice/mdts/commit/d2e77de)) ([#353](https://github.com/unhappychoice/mdts/pull/353))
- Bump eslint from 9.38.0 to 9.39.1 in /packages/frontend ([c3c7236](https://github.com/unhappychoice/mdts/commit/c3c7236)) ([#351](https://github.com/unhappychoice/mdts/pull/351))
- Bump typescript-eslint from 8.46.2 to 8.46.3 ([6dfec64](https://github.com/unhappychoice/mdts/commit/6dfec64)) ([#350](https://github.com/unhappychoice/mdts/pull/350))
- Bump simple-git from 3.29.0 to 3.30.0 ([6400cfb](https://github.com/unhappychoice/mdts/commit/6400cfb)) ([#347](https://github.com/unhappychoice/mdts/pull/347))
- Bump simple-git from 3.28.0 to 3.29.0 ([6db147e](https://github.com/unhappychoice/mdts/commit/6db147e)) ([#344](https://github.com/unhappychoice/mdts/pull/344))
- Bump @mui/x-tree-view in /packages/frontend ([b5fa727](https://github.com/unhappychoice/mdts/commit/b5fa727)) ([#343](https://github.com/unhappychoice/mdts/pull/343))
- Bump @eslint/compat in /packages/frontend ([1ba1d22](https://github.com/unhappychoice/mdts/commit/1ba1d22)) ([#342](https://github.com/unhappychoice/mdts/pull/342))
- Bump react-router-dom in /packages/frontend ([3c9e79c](https://github.com/unhappychoice/mdts/commit/3c9e79c)) ([#341](https://github.com/unhappychoice/mdts/pull/341))
- Bump @types/aws-lambda from 8.10.156 to 8.10.157 ([849fb62](https://github.com/unhappychoice/mdts/commit/849fb62)) ([#340](https://github.com/unhappychoice/mdts/pull/340))
- Bump axios from 1.13.0 to 1.13.1 ([7787f70](https://github.com/unhappychoice/mdts/commit/7787f70)) ([#339](https://github.com/unhappychoice/mdts/pull/339))
- Bump react-syntax-highlighter in /packages/frontend ([c1625f2](https://github.com/unhappychoice/mdts/commit/c1625f2)) ([#338](https://github.com/unhappychoice/mdts/pull/338))
- Bump axios from 1.12.2 to 1.13.0 ([7419c23](https://github.com/unhappychoice/mdts/commit/7419c23)) ([#337](https://github.com/unhappychoice/mdts/pull/337))
- Bump @types/express from 5.0.4 to 5.0.5 ([2ebb14f](https://github.com/unhappychoice/mdts/commit/2ebb14f)) ([#336](https://github.com/unhappychoice/mdts/pull/336))
- Bump mermaid from 11.12.0 to 11.12.1 in /packages/frontend ([60dc3d8](https://github.com/unhappychoice/mdts/commit/60dc3d8)) ([#335](https://github.com/unhappychoice/mdts/pull/335))
- Bump commander from 14.0.1 to 14.0.2 ([9a575f1](https://github.com/unhappychoice/mdts/commit/9a575f1)) ([#334](https://github.com/unhappychoice/mdts/pull/334))
- Bump @babel/preset-react in /packages/frontend ([ed7d684](https://github.com/unhappychoice/mdts/commit/ed7d684)) ([#333](https://github.com/unhappychoice/mdts/pull/333))
- Bump eslint-plugin-react-hooks in /packages/frontend ([13d9ada](https://github.com/unhappychoice/mdts/commit/13d9ada)) ([#332](https://github.com/unhappychoice/mdts/pull/332))
- Bump @babel/preset-env in /packages/frontend ([f29c716](https://github.com/unhappychoice/mdts/commit/f29c716)) ([#329](https://github.com/unhappychoice/mdts/pull/329))
- Bump @babel/preset-typescript in /packages/frontend ([42a246e](https://github.com/unhappychoice/mdts/commit/42a246e)) ([#331](https://github.com/unhappychoice/mdts/pull/331))
- Bump @babel/core in /packages/frontend ([c611bc5](https://github.com/unhappychoice/mdts/commit/c611bc5)) ([#330](https://github.com/unhappychoice/mdts/pull/330))
- Bump @types/express from 5.0.3 to 5.0.4 ([0ece22d](https://github.com/unhappychoice/mdts/commit/0ece22d)) ([#328](https://github.com/unhappychoice/mdts/pull/328))
- Bump @mui/x-tree-view in /packages/frontend ([95b0677](https://github.com/unhappychoice/mdts/commit/95b0677)) ([#327](https://github.com/unhappychoice/mdts/pull/327))
- Bump @reduxjs/toolkit in /packages/frontend ([8e7cf35](https://github.com/unhappychoice/mdts/commit/8e7cf35)) ([#326](https://github.com/unhappychoice/mdts/pull/326))
- Bump eslint from 9.37.0 to 9.38.0 in /packages/frontend ([0c823d2](https://github.com/unhappychoice/mdts/commit/0c823d2)) ([#318](https://github.com/unhappychoice/mdts/pull/318))
- Bump @stylistic/eslint-plugin in /packages/frontend ([a2b437d](https://github.com/unhappychoice/mdts/commit/a2b437d)) ([#317](https://github.com/unhappychoice/mdts/pull/317))
- Bump @typescript-eslint/parser in /packages/frontend ([6749b0f](https://github.com/unhappychoice/mdts/commit/6749b0f)) ([#324](https://github.com/unhappychoice/mdts/pull/324))
- Bump typescript-eslint from 8.46.1 to 8.46.2 ([15d34ac](https://github.com/unhappychoice/mdts/commit/15d34ac)) ([#323](https://github.com/unhappychoice/mdts/pull/323))
- Bump typescript-eslint in /packages/frontend ([4105983](https://github.com/unhappychoice/mdts/commit/4105983)) ([#322](https://github.com/unhappychoice/mdts/pull/322))
- Bump @typescript-eslint/parser from 8.46.1 to 8.46.2 ([1e2e696](https://github.com/unhappychoice/mdts/commit/1e2e696)) ([#321](https://github.com/unhappychoice/mdts/pull/321))
- Bump @stylistic/eslint-plugin from 5.4.0 to 5.5.0 ([6fb5fc1](https://github.com/unhappychoice/mdts/commit/6fb5fc1)) ([#316](https://github.com/unhappychoice/mdts/pull/316))
- Bump eslint from 9.37.0 to 9.38.0 ([fba7b46](https://github.com/unhappychoice/mdts/commit/fba7b46)) ([#315](https://github.com/unhappychoice/mdts/pull/315))
- Bump @reduxjs/toolkit in /packages/frontend ([998a40c](https://github.com/unhappychoice/mdts/commit/998a40c)) ([#313](https://github.com/unhappychoice/mdts/pull/313))
- Bump @mui/x-tree-view in /packages/frontend ([e51688f](https://github.com/unhappychoice/mdts/commit/e51688f)) ([#314](https://github.com/unhappychoice/mdts/pull/314))
- Bump @types/aws-lambda from 8.10.155 to 8.10.156 ([28792f0](https://github.com/unhappychoice/mdts/commit/28792f0)) ([#312](https://github.com/unhappychoice/mdts/pull/312))
- Bump typescript-eslint from 8.46.0 to 8.46.1 ([ace257f](https://github.com/unhappychoice/mdts/commit/ace257f)) ([#311](https://github.com/unhappychoice/mdts/pull/311))
- Bump @typescript-eslint/parser in /packages/frontend ([3671fad](https://github.com/unhappychoice/mdts/commit/3671fad)) ([#308](https://github.com/unhappychoice/mdts/pull/308))
- Bump @typescript-eslint/parser from 8.46.0 to 8.46.1 ([0e44267](https://github.com/unhappychoice/mdts/commit/0e44267)) ([#307](https://github.com/unhappychoice/mdts/pull/307))
- Bump typescript-eslint in /packages/frontend ([d42dc9d](https://github.com/unhappychoice/mdts/commit/d42dc9d)) ([#306](https://github.com/unhappychoice/mdts/pull/306))
- Bump ts-jest from 29.4.4 to 29.4.5 ([cbc8e46](https://github.com/unhappychoice/mdts/commit/cbc8e46)) ([#305](https://github.com/unhappychoice/mdts/pull/305))
- Bump @mui/x-tree-view in /packages/frontend ([9aec192](https://github.com/unhappychoice/mdts/commit/9aec192)) ([#304](https://github.com/unhappychoice/mdts/pull/304))
- Bump eslint-plugin-react-hooks in /packages/frontend ([df8ad8f](https://github.com/unhappychoice/mdts/commit/df8ad8f)) ([#303](https://github.com/unhappychoice/mdts/pull/303))
- Bump react-router-dom in /packages/frontend ([2f15176](https://github.com/unhappychoice/mdts/commit/2f15176)) ([#302](https://github.com/unhappychoice/mdts/pull/302))
- Bump webpack in /packages/frontend ([4601c27](https://github.com/unhappychoice/mdts/commit/4601c27)) ([#301](https://github.com/unhappychoice/mdts/pull/301))
- Bump typescript-eslint from 8.45.0 to 8.46.0 ([4c78399](https://github.com/unhappychoice/mdts/commit/4c78399)) ([#299](https://github.com/unhappychoice/mdts/pull/299))
- Bump @typescript-eslint/parser in /packages/frontend ([8591edd](https://github.com/unhappychoice/mdts/commit/8591edd)) ([#298](https://github.com/unhappychoice/mdts/pull/298))
- Bump @typescript-eslint/parser from 8.45.0 to 8.46.0 ([597b9bc](https://github.com/unhappychoice/mdts/commit/597b9bc)) ([#297](https://github.com/unhappychoice/mdts/pull/297))
- Bump typescript-eslint in /packages/frontend ([b2ed2a0](https://github.com/unhappychoice/mdts/commit/b2ed2a0)) ([#295](https://github.com/unhappychoice/mdts/pull/295))
- Bump @types/aws-lambda from 8.10.153 to 8.10.155 ([b10d1fa](https://github.com/unhappychoice/mdts/commit/b10d1fa)) ([#294](https://github.com/unhappychoice/mdts/pull/294))
- Bump eslint from 9.36.0 to 9.37.0 ([ab83602](https://github.com/unhappychoice/mdts/commit/ab83602)) ([#293](https://github.com/unhappychoice/mdts/pull/293))
- Bump eslint-plugin-react-hooks in /packages/frontend ([5bddde1](https://github.com/unhappychoice/mdts/commit/5bddde1)) ([#292](https://github.com/unhappychoice/mdts/pull/292))
- Bump eslint from 9.36.0 to 9.37.0 in /packages/frontend ([e32c898](https://github.com/unhappychoice/mdts/commit/e32c898)) ([#291](https://github.com/unhappychoice/mdts/pull/291))
- Bump @testing-library/jest-dom in /packages/frontend ([107173b](https://github.com/unhappychoice/mdts/commit/107173b)) ([#290](https://github.com/unhappychoice/mdts/pull/290))
- Bump @mui/x-tree-view in /packages/frontend ([088fa08](https://github.com/unhappychoice/mdts/commit/088fa08)) ([#289](https://github.com/unhappychoice/mdts/pull/289))
- Bump webpack in /packages/frontend ([30597dc](https://github.com/unhappychoice/mdts/commit/30597dc)) ([#276](https://github.com/unhappychoice/mdts/pull/276))
- Bump @mui/icons-material in /packages/frontend ([0777f2b](https://github.com/unhappychoice/mdts/commit/0777f2b)) ([#288](https://github.com/unhappychoice/mdts/pull/288))
- Bump eslint-plugin-react-hooks in /packages/frontend ([064bbf4](https://github.com/unhappychoice/mdts/commit/064bbf4)) ([#286](https://github.com/unhappychoice/mdts/pull/286))
- Bump react-dom from 19.1.1 to 19.2.0 in /packages/frontend ([5cabb7d](https://github.com/unhappychoice/mdts/commit/5cabb7d)) ([#283](https://github.com/unhappychoice/mdts/pull/283))
- Bump typescript from 5.9.2 to 5.9.3 ([3d502c3](https://github.com/unhappychoice/mdts/commit/3d502c3)) ([#282](https://github.com/unhappychoice/mdts/pull/282))
- Bump @types/aws-lambda from 8.10.152 to 8.10.153 ([021284d](https://github.com/unhappychoice/mdts/commit/021284d)) ([#281](https://github.com/unhappychoice/mdts/pull/281))
- Bump @testing-library/jest-dom in /packages/frontend ([bc3e17b](https://github.com/unhappychoice/mdts/commit/bc3e17b)) ([#280](https://github.com/unhappychoice/mdts/pull/280))
- Bump @typescript-eslint/parser in /packages/frontend ([f3eb8ce](https://github.com/unhappychoice/mdts/commit/f3eb8ce)) ([#277](https://github.com/unhappychoice/mdts/pull/277))
- Bump typescript-eslint from 8.44.1 to 8.45.0 ([c290632](https://github.com/unhappychoice/mdts/commit/c290632)) ([#275](https://github.com/unhappychoice/mdts/pull/275))
- Bump typescript-eslint in /packages/frontend ([1974c1a](https://github.com/unhappychoice/mdts/commit/1974c1a)) ([#274](https://github.com/unhappychoice/mdts/pull/274))
- Bump @typescript-eslint/parser from 8.44.1 to 8.45.0 ([13820c5](https://github.com/unhappychoice/mdts/commit/13820c5)) ([#273](https://github.com/unhappychoice/mdts/pull/273))
- Bump react-router-dom in /packages/frontend ([61c1cb2](https://github.com/unhappychoice/mdts/commit/61c1cb2)) ([#272](https://github.com/unhappychoice/mdts/pull/272))
- Bump jest from 30.1.3 to 30.2.0 in /packages/frontend ([571802a](https://github.com/unhappychoice/mdts/commit/571802a)) ([#269](https://github.com/unhappychoice/mdts/pull/269))
- Bump jest-environment-jsdom in /packages/frontend ([d677dc3](https://github.com/unhappychoice/mdts/commit/d677dc3)) ([#271](https://github.com/unhappychoice/mdts/pull/271))
- Bump jest from 30.1.3 to 30.2.0 ([77c746e](https://github.com/unhappychoice/mdts/commit/77c746e)) ([#270](https://github.com/unhappychoice/mdts/pull/270))
- Bump babel-jest in /packages/frontend ([bdcce95](https://github.com/unhappychoice/mdts/commit/bdcce95)) ([#268](https://github.com/unhappychoice/mdts/pull/268))
- Bump @mui/x-tree-view in /packages/frontend ([c13250c](https://github.com/unhappychoice/mdts/commit/c13250c)) ([#267](https://github.com/unhappychoice/mdts/pull/267))
- Bump react-router-dom in /packages/frontend ([c46f9f5](https://github.com/unhappychoice/mdts/commit/c46f9f5)) ([#266](https://github.com/unhappychoice/mdts/pull/266))
- Bump typescript-eslint from 8.44.0 to 8.44.1 ([3d2545b](https://github.com/unhappychoice/mdts/commit/3d2545b)) ([#265](https://github.com/unhappychoice/mdts/pull/265))
- Bump @typescript-eslint/eslint-plugin ([e9cf47d](https://github.com/unhappychoice/mdts/commit/e9cf47d)) ([#263](https://github.com/unhappychoice/mdts/pull/263))
- Bump typescript-eslint in /packages/frontend ([ef8e5e1](https://github.com/unhappychoice/mdts/commit/ef8e5e1)) ([#264](https://github.com/unhappychoice/mdts/pull/264))
- Bump @eslint/compat in /packages/frontend ([ffa5086](https://github.com/unhappychoice/mdts/commit/ffa5086)) ([#262](https://github.com/unhappychoice/mdts/pull/262))
- Bump @typescript-eslint/parser from 8.44.0 to 8.44.1 ([1726aec](https://github.com/unhappychoice/mdts/commit/1726aec)) ([#261](https://github.com/unhappychoice/mdts/pull/261))
- Bump @typescript-eslint/parser in /packages/frontend ([eb62e26](https://github.com/unhappychoice/mdts/commit/eb62e26)) ([#260](https://github.com/unhappychoice/mdts/pull/260))
- Bump eslint from 9.35.0 to 9.36.0 in /packages/frontend ([d3320aa](https://github.com/unhappychoice/mdts/commit/d3320aa)) ([#259](https://github.com/unhappychoice/mdts/pull/259))
- Bump @stylistic/eslint-plugin in /packages/frontend ([9bc1e86](https://github.com/unhappychoice/mdts/commit/9bc1e86)) ([#258](https://github.com/unhappychoice/mdts/pull/258))
- Bump eslint from 9.35.0 to 9.36.0 ([7a57b14](https://github.com/unhappychoice/mdts/commit/7a57b14)) ([#257](https://github.com/unhappychoice/mdts/pull/257))
- Bump @stylistic/eslint-plugin from 5.3.1 to 5.4.0 ([958b0f8](https://github.com/unhappychoice/mdts/commit/958b0f8)) ([#256](https://github.com/unhappychoice/mdts/pull/256))
- Bump ts-jest from 29.4.3 to 29.4.4 ([056d65e](https://github.com/unhappychoice/mdts/commit/056d65e)) ([#255](https://github.com/unhappychoice/mdts/pull/255))
- Bump mermaid from 11.11.0 to 11.12.0 in /packages/frontend ([2c3b7bd](https://github.com/unhappychoice/mdts/commit/2c3b7bd)) ([#254](https://github.com/unhappychoice/mdts/pull/254))
- Bump ts-jest from 29.4.2 to 29.4.3 ([cc5ea24](https://github.com/unhappychoice/mdts/commit/cc5ea24)) ([#253](https://github.com/unhappychoice/mdts/pull/253))
- Bump @mui/x-tree-view in /packages/frontend ([ca50e8f](https://github.com/unhappychoice/mdts/commit/ca50e8f)) ([#252](https://github.com/unhappychoice/mdts/pull/252))
- Bump typescript-eslint from 8.43.0 to 8.44.0 ([c133acc](https://github.com/unhappychoice/mdts/commit/c133acc)) ([#248](https://github.com/unhappychoice/mdts/pull/248))
- Bump @typescript-eslint/parser in /packages/frontend ([3ae9563](https://github.com/unhappychoice/mdts/commit/3ae9563)) ([#247](https://github.com/unhappychoice/mdts/pull/247))
- Bump ts-jest from 29.4.1 to 29.4.2 ([972bcf4](https://github.com/unhappychoice/mdts/commit/972bcf4)) ([#246](https://github.com/unhappychoice/mdts/pull/246))
- Bump typescript-eslint in /packages/frontend ([3451904](https://github.com/unhappychoice/mdts/commit/3451904)) ([#245](https://github.com/unhappychoice/mdts/pull/245))
- Bump @typescript-eslint/parser from 8.43.0 to 8.44.0 ([0e0edbe](https://github.com/unhappychoice/mdts/commit/0e0edbe)) ([#244](https://github.com/unhappychoice/mdts/pull/244))
- Bump axios from 1.12.0 to 1.12.2 ([6e60ad5](https://github.com/unhappychoice/mdts/commit/6e60ad5)) ([#243](https://github.com/unhappychoice/mdts/pull/243))
- Bump commander from 14.0.0 to 14.0.1 ([acb26b2](https://github.com/unhappychoice/mdts/commit/acb26b2)) ([#242](https://github.com/unhappychoice/mdts/pull/242))
- Bump react-router-dom in /packages/frontend ([dd8745e](https://github.com/unhappychoice/mdts/commit/dd8745e)) ([#241](https://github.com/unhappychoice/mdts/pull/241))
- Bump axios from 1.11.0 to 1.12.0 ([af67152](https://github.com/unhappychoice/mdts/commit/af67152)) ([#240](https://github.com/unhappychoice/mdts/pull/240))
- Bump @mui/x-tree-view in /packages/frontend ([186119b](https://github.com/unhappychoice/mdts/commit/186119b)) ([#239](https://github.com/unhappychoice/mdts/pull/239))
- Bump typescript-eslint from 8.42.0 to 8.43.0 ([c5ec1c5](https://github.com/unhappychoice/mdts/commit/c5ec1c5)) ([#238](https://github.com/unhappychoice/mdts/pull/238))
- Bump @typescript-eslint/parser from 8.42.0 to 8.43.0 ([48b2eba](https://github.com/unhappychoice/mdts/commit/48b2eba)) ([#236](https://github.com/unhappychoice/mdts/pull/236))
- Bump @typescript-eslint/parser in /packages/frontend ([795d342](https://github.com/unhappychoice/mdts/commit/795d342)) ([#235](https://github.com/unhappychoice/mdts/pull/235))
- Bump chalk from 5.6.0 to 5.6.2 ([2acc076](https://github.com/unhappychoice/mdts/commit/2acc076)) ([#234](https://github.com/unhappychoice/mdts/pull/234))
- Bump typescript-eslint in /packages/frontend ([d0b1522](https://github.com/unhappychoice/mdts/commit/d0b1522)) ([#233](https://github.com/unhappychoice/mdts/pull/233))
- Bump @babel/core in /packages/frontend ([ef126e9](https://github.com/unhappychoice/mdts/commit/ef126e9)) ([#231](https://github.com/unhappychoice/mdts/pull/231))
- Bump eslint from 9.34.0 to 9.35.0 in /packages/frontend ([a03901a](https://github.com/unhappychoice/mdts/commit/a03901a)) ([#230](https://github.com/unhappychoice/mdts/pull/230))
- Bump eslint from 9.34.0 to 9.35.0 ([1fdf86d](https://github.com/unhappychoice/mdts/commit/1fdf86d)) ([#229](https://github.com/unhappychoice/mdts/pull/229))
- Bump mermaid from 11.10.1 to 11.11.0 in /packages/frontend ([3ae7387](https://github.com/unhappychoice/mdts/commit/3ae7387)) ([#228](https://github.com/unhappychoice/mdts/pull/228))
- Bump @mui/x-tree-view in /packages/frontend ([01704b7](https://github.com/unhappychoice/mdts/commit/01704b7)) ([#227](https://github.com/unhappychoice/mdts/pull/227))
- Bump jest from 30.1.1 to 30.1.3 ([9cadc8e](https://github.com/unhappychoice/mdts/commit/9cadc8e)) ([#218](https://github.com/unhappychoice/mdts/pull/218))
- Bump @reduxjs/toolkit in /packages/frontend ([65fbf50](https://github.com/unhappychoice/mdts/commit/65fbf50)) ([#223](https://github.com/unhappychoice/mdts/pull/223))
- Bump jest from 30.1.2 to 30.1.3 in /packages/frontend ([e81a5a1](https://github.com/unhappychoice/mdts/commit/e81a5a1)) ([#226](https://github.com/unhappychoice/mdts/pull/226))
- Bump @typescript-eslint/parser in /packages/frontend ([274e4c9](https://github.com/unhappychoice/mdts/commit/274e4c9)) ([#225](https://github.com/unhappychoice/mdts/pull/225))
- Bump typescript-eslint in /packages/frontend ([582b848](https://github.com/unhappychoice/mdts/commit/582b848)) ([#222](https://github.com/unhappychoice/mdts/pull/222))
- Bump @typescript-eslint/parser from 8.41.0 to 8.42.0 ([3b45952](https://github.com/unhappychoice/mdts/commit/3b45952)) ([#221](https://github.com/unhappychoice/mdts/pull/221))
- Bump typescript-eslint from 8.41.0 to 8.42.0 ([4cb6c19](https://github.com/unhappychoice/mdts/commit/4cb6c19)) ([#219](https://github.com/unhappychoice/mdts/pull/219))
- Bump jest from 30.1.1 to 30.1.2 ([0cc1a05](https://github.com/unhappychoice/mdts/commit/0cc1a05)) ([#217](https://github.com/unhappychoice/mdts/pull/217))
- Bump @mui/x-tree-view in /packages/frontend ([db78f67](https://github.com/unhappychoice/mdts/commit/db78f67)) ([#212](https://github.com/unhappychoice/mdts/pull/212))
- Bump @stylistic/eslint-plugin in /packages/frontend ([ffe0bcb](https://github.com/unhappychoice/mdts/commit/ffe0bcb)) ([#216](https://github.com/unhappychoice/mdts/pull/216))
- Bump @stylistic/eslint-plugin from 5.2.3 to 5.3.1 ([0223d8d](https://github.com/unhappychoice/mdts/commit/0223d8d)) ([#214](https://github.com/unhappychoice/mdts/pull/214))
- Bump @mui/icons-material in /packages/frontend ([05fe0f1](https://github.com/unhappychoice/mdts/commit/05fe0f1)) ([#213](https://github.com/unhappychoice/mdts/pull/213))
- Bump jest-environment-jsdom in /packages/frontend ([e0dab1a](https://github.com/unhappychoice/mdts/commit/e0dab1a)) ([#210](https://github.com/unhappychoice/mdts/pull/210))
- Bump jest from 30.1.1 to 30.1.2 in /packages/frontend ([fb0835b](https://github.com/unhappychoice/mdts/commit/fb0835b)) ([#209](https://github.com/unhappychoice/mdts/pull/209))
- Bump babel-jest in /packages/frontend ([cf31c8d](https://github.com/unhappychoice/mdts/commit/cf31c8d)) ([#207](https://github.com/unhappychoice/mdts/pull/207))
- Bump jest from 30.1.0 to 30.1.1 in /packages/frontend ([0f3dfdb](https://github.com/unhappychoice/mdts/commit/0f3dfdb)) ([#206](https://github.com/unhappychoice/mdts/pull/206))
- Bump jest from 30.1.0 to 30.1.1 ([4b60963](https://github.com/unhappychoice/mdts/commit/4b60963)) ([#208](https://github.com/unhappychoice/mdts/pull/208))
- Bump jest-environment-jsdom in /packages/frontend ([b788360](https://github.com/unhappychoice/mdts/commit/b788360)) ([#205](https://github.com/unhappychoice/mdts/pull/205))

### 💚 CI/Test
- update snapshots for @mui/x-tree-view 8.18.0 ([19dd187](https://github.com/unhappychoice/mdts/commit/19dd187)) ([#370](https://github.com/unhappychoice/mdts/pull/370))
- stabilize plantuml route tests ([7d8a3fa](https://github.com/unhappychoice/mdts/commit/7d8a3fa)) ([#251](https://github.com/unhappychoice/mdts/pull/251))

### 🛠️ Chores
- revert version to 0.14.0 ([fc93f7b](https://github.com/unhappychoice/mdts/commit/fc93f7b))
- revert version to 0.14.0 ([ad48879](https://github.com/unhappychoice/mdts/commit/ad48879))
- migrate to npm trusted publishing with OIDC ([78a1f90](https://github.com/unhappychoice/mdts/commit/78a1f90)) ([#455](https://github.com/unhappychoice/mdts/pull/455))
- update snapshots and package lock files ([986e9c1](https://github.com/unhappychoice/mdts/commit/986e9c1)) ([#252](https://github.com/unhappychoice/mdts/pull/252))

## v0.14.0

### ✨ Features
- Implement PlantUML diagram support ([f22076d](https://github.com/unhappychoice/mdts/commit/f22076d)) ([#204](https://github.com/unhappychoice/mdts/pull/204))
  - Add server-side PlantUML rendering with node-plantuml-back ([2d94f60](https://github.com/unhappychoice/mdts/commit/2d94f60))
  - Add frontend PlantUML support with Redux integration ([d59c21a](https://github.com/unhappychoice/mdts/commit/d59c21a))
  - Add comprehensive test suite for PlantUML functionality ([08d1581](https://github.com/unhappychoice/mdts/commit/08d1581))
  - Add PlantUML documentation and examples ([43c0b99](https://github.com/unhappychoice/mdts/commit/43c0b99))
- Add Netlify static site deployment for live demo ([781bf53](https://github.com/unhappychoice/mdts/commit/781bf53)) ([#191](https://github.com/unhappychoice/mdts/pull/191))
  - Add complete Netlify deployment infrastructure ([7cbd872](https://github.com/unhappychoice/mdts/commit/7cbd872))
  - Add live demo link to README ([e069611](https://github.com/unhappychoice/mdts/commit/e069611))
  - Enable production mode builds for frontend ([dd2a15b](https://github.com/unhappychoice/mdts/commit/dd2a15b))
  - Add Netlify deployment dependencies and build script ([35dd9c6](https://github.com/unhappychoice/mdts/commit/35dd9c6))
- Enhance welcome pages with improved content and navigation ([ee397f8](https://github.com/unhappychoice/mdts/commit/ee397f8))
- Reorganize demo structure and add frontmatter to examples ([695b446](https://github.com/unhappychoice/mdts/commit/695b446))

### 🐛 Bug Fixes
- Fix table width overflow issues ([8d36338](https://github.com/unhappychoice/mdts/commit/8d36338)) ([#196](https://github.com/unhappychoice/mdts/pull/196))

### 👍 Improvements
- Improve horizontal scrollbar styling ([ba9235b](https://github.com/unhappychoice/mdts/commit/ba9235b)) ([#197](https://github.com/unhappychoice/mdts/pull/197))

### 📝 Documentation
- Modernize documentation with comprehensive guides and features ([be0f39b](https://github.com/unhappychoice/mdts/commit/be0f39b)) ([#199](https://github.com/unhappychoice/mdts/pull/199))

### 🆙 Update Packages
- Bump babel-jest from 30.0.5 to 30.1.0 in /packages/frontend ([5d139a1](https://github.com/unhappychoice/mdts/commit/5d139a1)) ([#202](https://github.com/unhappychoice/mdts/pull/202))
- Bump jest from 30.0.5 to 30.1.0 in /packages/frontend ([9948249](https://github.com/unhappychoice/mdts/commit/9948249)) ([#201](https://github.com/unhappychoice/mdts/pull/201))
- Bump jest from 30.0.5 to 30.1.0 ([5fe4873](https://github.com/unhappychoice/mdts/commit/5fe4873)) ([#200](https://github.com/unhappychoice/mdts/pull/200))
- Bump @typescript-eslint/eslint-plugin from 8.40.0 to 8.41.0 ([be5a9dc](https://github.com/unhappychoice/mdts/commit/be5a9dc)) ([#189](https://github.com/unhappychoice/mdts/pull/189))
- Bump @typescript-eslint/parser from 8.40.0 to 8.41.0 in /packages/frontend ([0bef394](https://github.com/unhappychoice/mdts/commit/0bef394)) ([#188](https://github.com/unhappychoice/mdts/pull/188))
- Bump typescript-eslint from 8.40.0 to 8.41.0 in /packages/frontend ([1f138b6](https://github.com/unhappychoice/mdts/commit/1f138b6)) ([#187](https://github.com/unhappychoice/mdts/pull/187))
- Bump react-syntax-highlighter from 15.6.3 to 15.6.6 in /packages/frontend ([51408d7](https://github.com/unhappychoice/mdts/commit/51408d7)) ([#184](https://github.com/unhappychoice/mdts/pull/184))
- Bump @typescript-eslint/parser from 8.40.0 to 8.41.0 ([959821c](https://github.com/unhappychoice/mdts/commit/959821c)) ([#185](https://github.com/unhappychoice/mdts/pull/185))
- Bump typescript-eslint from 8.40.0 to 8.41.0 ([d130c39](https://github.com/unhappychoice/mdts/commit/d130c39)) ([#186](https://github.com/unhappychoice/mdts/pull/186))
- Bump mermaid from 11.10.0 to 11.10.1 in /packages/frontend ([0372c9b](https://github.com/unhappychoice/mdts/commit/0372c9b)) ([#182](https://github.com/unhappychoice/mdts/pull/182))
- Bump eslint from 9.33.0 to 9.34.0 in /packages/frontend ([4769e5f](https://github.com/unhappychoice/mdts/commit/4769e5f)) ([#181](https://github.com/unhappychoice/mdts/pull/181))
- Bump react-router-dom from 7.8.1 to 7.8.2 in /packages/frontend ([d00bdd4](https://github.com/unhappychoice/mdts/commit/d00bdd4)) ([#183](https://github.com/unhappychoice/mdts/pull/183))
- Bump eslint from 9.33.0 to 9.34.0 ([7881bdd](https://github.com/unhappychoice/mdts/commit/7881bdd)) ([#180](https://github.com/unhappychoice/mdts/pull/180))
- Bump react-syntax-highlighter from 15.6.1 to 15.6.3 in /packages/frontend ([677d204](https://github.com/unhappychoice/mdts/commit/677d204)) ([#179](https://github.com/unhappychoice/mdts/pull/179))
- Bump @mui/x-tree-view from 8.10.0 to 8.10.2 in /packages/frontend ([68b63b4](https://github.com/unhappychoice/mdts/commit/68b63b4)) ([#177](https://github.com/unhappychoice/mdts/pull/177))
- Bump @testing-library/jest-dom from 6.7.0 to 6.8.0 in /packages/frontend ([448acfc](https://github.com/unhappychoice/mdts/commit/448acfc)) ([#178](https://github.com/unhappychoice/mdts/pull/178))
- Bump typescript-eslint from 8.39.1 to 8.40.0 in /packages/frontend ([c1c7d4e](https://github.com/unhappychoice/mdts/commit/c1c7d4e)) ([#173](https://github.com/unhappychoice/mdts/pull/173))
- Bump typescript-eslint from 8.39.1 to 8.40.0 ([58e84f0](https://github.com/unhappychoice/mdts/commit/58e84f0)) ([#175](https://github.com/unhappychoice/mdts/pull/175))
- Bump @typescript-eslint/parser from 8.39.1 to 8.40.0 ([cf8b1b0](https://github.com/unhappychoice/mdts/commit/cf8b1b0)) ([#171](https://github.com/unhappychoice/mdts/pull/171))
- Bump mermaid from 11.9.0 to 11.10.0 in /packages/frontend ([38c1a4e](https://github.com/unhappychoice/mdts/commit/38c1a4e)) ([#176](https://github.com/unhappychoice/mdts/pull/176))
- Bump webpack from 5.101.2 to 5.101.3 in /packages/frontend ([22d7eed](https://github.com/unhappychoice/mdts/commit/22d7eed)) ([#172](https://github.com/unhappychoice/mdts/pull/172))
- Bump @typescript-eslint/parser from 8.39.1 to 8.40.0 in /packages/frontend ([2ee7304](https://github.com/unhappychoice/mdts/commit/2ee7304)) ([#170](https://github.com/unhappychoice/mdts/pull/170))
- Bump react-router-dom from 7.8.0 to 7.8.1 in /packages/frontend ([407fe5e](https://github.com/unhappychoice/mdts/commit/407fe5e)) ([#167](https://github.com/unhappychoice/mdts/pull/167))
- Bump chalk from 5.5.0 to 5.6.0 ([6aedcf8](https://github.com/unhappychoice/mdts/commit/6aedcf8)) ([#168](https://github.com/unhappychoice/mdts/pull/168))

### 🛠️ Chores
- Update TypeScript configuration for Netlify functions ([ba7daf4](https://github.com/unhappychoice/mdts/commit/ba7daf4))

## v0.13.0

### ✨ Features
- Support github alerts ([2e3baa4](https://github.com/unhappychoice/mdts/commit/2e3baa4)) ([#163](https://github.com/unhappychoice/mdts/pull/163))

### 🐛 Bug Fixes
- Do not show loading indicator on live reload ([668c690](https://github.com/unhappychoice/mdts/commit/668c690)) ([#165](https://github.com/unhappychoice/mdts/pull/165))

### 🆙 Update Packages
- Bump @babel/preset-env in /packages/frontend ([75f264b](https://github.com/unhappychoice/mdts/commit/75f264b)) ([#160](https://github.com/unhappychoice/mdts/pull/160))
- Bump html-webpack-plugin in /packages/frontend ([1fa8200](https://github.com/unhappychoice/mdts/commit/1fa8200)) ([#162](https://github.com/unhappychoice/mdts/pull/162))
- Bump @babel/core from 7.28.0 to 7.28.3 in /packages/frontend ([1e415a0](https://github.com/unhappychoice/mdts/commit/1e415a0)) ([#161](https://github.com/unhappychoice/mdts/pull/161))
- Bump webpack from 5.101.1 to 5.101.2 in /packages/frontend ([83c597d](https://github.com/unhappychoice/mdts/commit/83c597d)) ([#159](https://github.com/unhappychoice/mdts/pull/159))
- Bump @testing-library/jest-dom in /packages/frontend ([b6cfc50](https://github.com/unhappychoice/mdts/commit/b6cfc50)) ([#157](https://github.com/unhappychoice/mdts/pull/157))
- Bump webpack from 5.101.0 to 5.101.1 in /packages/frontend ([77c9e8f](https://github.com/unhappychoice/mdts/commit/77c9e8f)) ([#156](https://github.com/unhappychoice/mdts/pull/156))
- Bump copy-webpack-plugin in /packages/frontend ([5388403](https://github.com/unhappychoice/mdts/commit/5388403)) ([#155](https://github.com/unhappychoice/mdts/pull/155))
- Bump typescript-eslint from 8.39.0 to 8.39.1 ([dc66c25](https://github.com/unhappychoice/mdts/commit/dc66c25)) ([#153](https://github.com/unhappychoice/mdts/pull/153))
- Bump @typescript-eslint/parser from 8.39.0 to 8.39.1 ([cb96fc8](https://github.com/unhappychoice/mdts/commit/cb96fc8)) ([#152](https://github.com/unhappychoice/mdts/pull/152))
- Bump typescript-eslint in /packages/frontend ([1e3d4e4](https://github.com/unhappychoice/mdts/commit/1e3d4e4)) ([#150](https://github.com/unhappychoice/mdts/pull/150))
- Bump @typescript-eslint/parser in /packages/frontend ([c84b272](https://github.com/unhappychoice/mdts/commit/c84b272)) ([#149](https://github.com/unhappychoice/mdts/pull/149))
- Bump @mui/x-tree-view in /packages/frontend ([5fcfb27](https://github.com/unhappychoice/mdts/commit/5fcfb27)) ([#145](https://github.com/unhappychoice/mdts/pull/145))
- Bump eslint from 9.32.0 to 9.33.0 ([9ff1a07](https://github.com/unhappychoice/mdts/commit/9ff1a07)) ([#146](https://github.com/unhappychoice/mdts/pull/146))
- Bump eslint from 9.32.0 to 9.33.0 in /packages/frontend ([7002414](https://github.com/unhappychoice/mdts/commit/7002414)) ([#147](https://github.com/unhappychoice/mdts/pull/147))
- Bump @eslint/compat from 1.3.1 to 1.3.2 in /packages/frontend ([9808d93](https://github.com/unhappychoice/mdts/commit/9808d93)) ([#148](https://github.com/unhappychoice/mdts/pull/148))

### 📝 Others
- Update documents ([c73fe4d](https://github.com/unhappychoice/mdts/commit/c73fe4d)) ([#166](https://github.com/unhappychoice/mdts/pull/166))
- Rename sample_documents to example_documents ([2ec0d16](https://github.com/unhappychoice/mdts/commit/2ec0d16)) ([#166](https://github.com/unhappychoice/mdts/pull/166))

## v0.12.0

### ✨ Features
- Support math syntax ([5754480](https://github.com/unhappychoice/mdts/commit/5754480)) ([#136](https://github.com/unhappychoice/mdts/pull/136))

### 🐛 Bug Fixes
- Fix outline ID is not correct ([892a8b6](https://github.com/unhappychoice/mdts/commit/892a8b6)) ([#143](https://github.com/unhappychoice/mdts/pull/143))

### 👕 Code Style
- Enable Stylistic ([ce4ed8b](https://github.com/unhappychoice/mdts/commit/ce4ed8b)) ([#144](https://github.com/unhappychoice/mdts/pull/144))

### 🆙 Update Packages
- Bump react-router-dom in /packages/frontend ([af58c8d](https://github.com/unhappychoice/mdts/commit/af58c8d)) ([#142](https://github.com/unhappychoice/mdts/pull/142))
- Bump typescript from 5.8.3 to 5.9.2 ([4ffb3dc](https://github.com/unhappychoice/mdts/commit/4ffb3dc)) ([#137](https://github.com/unhappychoice/mdts/pull/137))
- Bump @mui/icons-material in /packages/frontend ([fb9b238](https://github.com/unhappychoice/mdts/commit/fb9b238)) ([#141](https://github.com/unhappychoice/mdts/pull/141))
- Bump @mui/material from 7.3.0 to 7.3.1 in /packages/frontend ([250cf07](https://github.com/unhappychoice/mdts/commit/250cf07)) ([#140](https://github.com/unhappychoice/mdts/pull/140))
- Bump typescript-eslint from 8.38.0 to 8.39.0 ([792b172](https://github.com/unhappychoice/mdts/commit/792b172)) ([#139](https://github.com/unhappychoice/mdts/pull/139))
- Bump @typescript-eslint/eslint-plugin from 8.38.0 to 8.39.0 ([72aaf02](https://github.com/unhappychoice/mdts/commit/72aaf02)) ([#135](https://github.com/unhappychoice/mdts/pull/135))
- Bump @mui/material from 7.2.0 to 7.3.0 in /packages/frontend ([597a6b0](https://github.com/unhappychoice/mdts/commit/597a6b0)) ([#127](https://github.com/unhappychoice/mdts/pull/127))
- Bump typescript-eslint in /packages/frontend ([05759fc](https://github.com/unhappychoice/mdts/commit/05759fc)) ([#132](https://github.com/unhappychoice/mdts/pull/132))
- Bump @typescript-eslint/parser in /packages/frontend ([d9df64c](https://github.com/unhappychoice/mdts/commit/d9df64c)) ([#133](https://github.com/unhappychoice/mdts/pull/133))
- Bump typescript from 5.8.3 to 5.9.2 ([764b36f](https://github.com/unhappychoice/mdts/commit/764b36f)) ([#131](https://github.com/unhappychoice/mdts/pull/131))
- Bump typescript-eslint from 8.38.0 to 8.39.0 ([3d9bf66](https://github.com/unhappychoice/mdts/commit/3d9bf66)) ([#129](https://github.com/unhappychoice/mdts/pull/129))
- Bump @mui/icons-material in /packages/frontend ([0be2a60](https://github.com/unhappychoice/mdts/commit/0be2a60)) ([#128](https://github.com/unhappychoice/mdts/pull/128))

### 💚 CI/Test
- Update spec ([07f9b56](https://github.com/unhappychoice/mdts/commit/07f9b56))
- Update spec ([355b79e](https://github.com/unhappychoice/mdts/commit/355b79e))

## v0.11.0

### ✨ Features
- Add base color theme setting feature ([3b5736c](https://github.com/unhappychoice/mdts/commit/3b5736c)) ([#124](https://github.com/unhappychoice/mdts/pull/124))

### 🆙 Update Packages
- Bump chalk from 5.4.1 to 5.5.0 ([e3f6949](https://github.com/unhappychoice/mdts/commit/e3f6949)) ([#126](https://github.com/unhappychoice/mdts/pull/126))
- Bump ts-jest from 29.4.0 to 29.4.1 ([0da7ec7](https://github.com/unhappychoice/mdts/commit/0da7ec7)) ([#125](https://github.com/unhappychoice/mdts/pull/125))

### 💚 CI/Test
- Update specs ([6728ebd](https://github.com/unhappychoice/mdts/commit/6728ebd))

## v0.10.0

### ✨ Features
- Implement color scheme setting ([6ccf9bf](https://github.com/unhappychoice/mdts/commit/6ccf9bf)) ([#120](https://github.com/unhappychoice/mdts/pull/120))
- Add font settings and improve config handling ([d0c65f0](https://github.com/unhappychoice/mdts/commit/d0c65f0)) ([#119](https://github.com/unhappychoice/mdts/pull/119))

### 🐛 Bug Fixes
- Fix livereloading is not working sometimes ([2817c24](https://github.com/unhappychoice/mdts/commit/2817c24)) ([#122](https://github.com/unhappychoice/mdts/pull/122))
- Fix misc bugs ([88eb66d](https://github.com/unhappychoice/mdts/commit/88eb66d)) ([#121](https://github.com/unhappychoice/mdts/pull/121))
- Fix scrollbar position ([88c7d35](https://github.com/unhappychoice/mdts/commit/88c7d35)) ([#119](https://github.com/unhappychoice/mdts/pull/119))

### 👍 Improvements
- Show mdts logo ([070c9e8](https://github.com/unhappychoice/mdts/commit/070c9e8)) ([#117](https://github.com/unhappychoice/mdts/pull/117))

### ♻️ Refactor
- Use rehype-slug instead of remark-slug ([b9c34b2](https://github.com/unhappychoice/mdts/commit/b9c34b2)) ([#116](https://github.com/unhappychoice/mdts/pull/116))
- Update server.ts for Express compatibility and refactor path handling ([0812eae](https://github.com/unhappychoice/mdts/commit/0812eae)) ([#109](https://github.com/unhappychoice/mdts/pull/109))

### 🆙 Update Packages
- Bump remark-slug from 7.0.1 to 8.0.0 in /packages/frontend ([f372951](https://github.com/unhappychoice/mdts/commit/f372951)) ([#116](https://github.com/unhappychoice/mdts/pull/116))
- Bump copy-webpack-plugin from 12.0.2 to 13.0.0 in /packages/frontend ([da35937](https://github.com/unhappychoice/mdts/commit/da35937)) ([#115](https://github.com/unhappychoice/mdts/pull/115))
- Bump @mui/x-tree-view from 8.9.0 to 8.9.2 in /packages/frontend ([1960d94](https://github.com/unhappychoice/mdts/commit/1960d94)) ([#118](https://github.com/unhappychoice/mdts/pull/118))
- Bump axios from 1.10.0 to 1.11.0 ([1a70f14](https://github.com/unhappychoice/mdts/commit/1a70f14)) ([#110](https://github.com/unhappychoice/mdts/pull/110))
- Bump @testing-library/jest-dom from 6.6.3 to 6.6.4 in /packages/frontend ([806d3c4](https://github.com/unhappychoice/mdts/commit/806d3c4)) ([#111](https://github.com/unhappychoice/mdts/pull/111))
- Bump webpack from 5.100.2 to 5.101.0 in /packages/frontend ([87857d0](https://github.com/unhappychoice/mdts/commit/87857d0)) ([#112](https://github.com/unhappychoice/mdts/pull/112))
- Bump supertest from 7.1.3 to 7.1.4 ([432f61c](https://github.com/unhappychoice/mdts/commit/432f61c)) ([#113](https://github.com/unhappychoice/mdts/pull/113))
- Bump express and @types/express ([f0a9ecc](https://github.com/unhappychoice/mdts/commit/f0a9ecc)) ([#109](https://github.com/unhappychoice/mdts/pull/109))

### 💚 CI/Test
- Update spec ([af6065b](https://github.com/unhappychoice/mdts/commit/af6065b)) ([#120](https://github.com/unhappychoice/mdts/pull/120))
- Update specs ([f0214a4](https://github.com/unhappychoice/mdts/commit/f0214a4)) ([#119](https://github.com/unhappychoice/mdts/pull/119))

## v0.9.0

### 🐛 Bug Fixes
- Handle FSWatcher errors ([202ee8c](https://github.com/unhappychoice/mdts/commit/202ee8c)) ([#105](https://github.com/unhappychoice/mdts/pull/105))
- Fix action trigger condition ([05aeaaa](https://github.com/unhappychoice/mdts/commit/05aeaaa)) ([#89](https://github.com/unhappychoice/mdts/pull/89))

### 👍 Improvements
- Do not show loading spinner on FileTree everytime ([ab58f8d](https://github.com/unhappychoice/mdts/commit/ab58f8d)) ([#105](https://github.com/unhappychoice/mdts/pull/105))
- Make scroll bars more pretty ([f1bbaff](https://github.com/unhappychoice/mdts/commit/f1bbaff)) ([#103](https://github.com/unhappychoice/mdts/pull/103))
- Set height to FileTreeContent / OutlineContent ([898c82c](https://github.com/unhappychoice/mdts/commit/898c82c)) ([#87](https://github.com/unhappychoice/mdts/pull/87))
- Make only markdown previwer section to scroll-able. ([2b84e01](https://github.com/unhappychoice/mdts/commit/2b84e01)) ([#87](https://github.com/unhappychoice/mdts/pull/87))
- Add CODEOWNERS ([58b9f08](https://github.com/unhappychoice/mdts/commit/58b9f08)) ([#89](https://github.com/unhappychoice/mdts/pull/89))
- Add CONTRIBUTING.md ([fd697ae](https://github.com/unhappychoice/mdts/commit/fd697ae)) ([#89](https://github.com/unhappychoice/mdts/pull/89))
- Update npm homepage ([a79c801](https://github.com/unhappychoice/mdts/commit/a79c801))

### ♻️ Refactor
- Refactor markdown.css ([7732bf4](https://github.com/unhappychoice/mdts/commit/7732bf4)) ([#103](https://github.com/unhappychoice/mdts/pull/103))

### 🆙 Update Packages
- Update dependencies:
    - react-dom ([3e66ddc](https://github.com/unhappychoice/mdts/commit/3e66ddc)) ([#98](https://github.com/unhappychoice/mdts/pull/98))
    - jest from 30.0.4 to 30.0.5 in /packages/frontend ([2b37f8a](https://github.com/unhappychoice/mdts/commit/2b37f8a)) ([#96](https://github.com/unhappychoice/mdts/pull/96))
    - react from 19.1.0 to 19.1.1 in /packages/frontend ([6851e2f](https://github.com/unhappychoice/mdts/commit/6851e2f)) ([#96](https://github.com/unhappychoice/mdts/pull/96))
    - @types/commander from 2.12.0 to 2.12.5 ([9e4a996](https://github.com/unhappychoice/mdts/commit/9e4a996)) ([#102](https://github.com/unhappychoice/mdts/pull/102))
    - jest from 30.0.4 to 30.0.5 ([cd6bf68](https://github.com/unhappychoice/mdts/commit/cd6bf68)) ([#101](https://github.com/unhappychoice/mdts/pull/101))
    - react-router-dom in /packages/frontend ([6e70ba5](https://github.com/unhappychoice/mdts/commit/6e70ba5)) ([#100](https://github.com/unhappychoice/mdts/pull/100))
    - jest-environment-jsdom in /packages/frontend ([67b44b8](https://github.com/unhappychoice/mdts/commit/67b44b8)) ([#99](https://github.com/unhappychoice/mdts/pull/99))
    - typescript-eslint from 8.37.0 to 8.38.0 ([fa1f7d0](https://github.com/unhappychoice/mdts/commit/fa1f7d0)) ([#95](https://github.com/unhappychoice/mdts/pull/95))
    - babel-jest from 30.0.4 to 30.0.5 in /packages/frontend ([2d25ba2](https://github.com/unhappychoice/mdts/commit/2d25ba2)) ([#93](https://github.com/unhappychoice/mdts/pull/93))

### 👕 Code Style
- Restore style ([f094a83](https://github.com/unhappychoice/mdts/commit/f094a83)) ([#87](https://github.com/unhappychoice/mdts/pull/87))

### 💚 CI/Test
- Update spec ([d65c97c](https://github.com/unhappychoice/mdts/commit/d65c97c)) ([#105](https://github.com/unhappychoice/mdts/pull/105))
- Update snapshot ([4383e0c](https://github.com/unhappychoice/mdts/commit/4383e0c)) ([#103](https://github.com/unhappychoice/mdts/pull/103))
- Add dependabot.yml ([70a0f9c](https://github.com/unhappychoice/mdts/commit/70a0f9c)) ([#92](https://github.com/unhappychoice/mdts/pull/92))
- Update snapshots ([f9b5f10](https://github.com/unhappychoice/mdts/commit/f9b5f10)) ([#87](https://github.com/unhappychoice/mdts/pull/87))

## v0.8.2

### 🐛 Bug Fixes
- Handle non-Git directories in filetree route ([ace45a2](https://github.com/unhappychoice/mdts/commit/ace45a2)) ([#84](https://github.com/unhappychoice/mdts/pull/84))

## v0.8.1

### 🐛 Bug Fixes
- Fix log color ([5743174](https://github.com/unhappychoice/mdts/commit/5743174)) ([#83](https://github.com/unhappychoice/mdts/pull/83))

## v0.8.0

### ✨ Features
- Add --host option ([9889148](https://github.com/unhappychoice/mdts/commit/9889148)) ([#82](https://github.com/unhappychoice/mdts/pull/82))
- Add silient option to CLI ([084d5bf](https://github.com/unhappychoice/mdts/commit/084d5bf)) ([#81](https://github.com/unhappychoice/mdts/pull/81))
- Improve log readability with chalk ([23977c1](https://github.com/unhappychoice/mdts/commit/23977c1)) ([#81](https://github.com/unhappychoice/mdts/pull/81))
- Show file git status ([5f8033c](https://github.com/unhappychoice/mdts/commit/5f8033c)) ([#80](https://github.com/unhappychoice/mdts/pull/80))
- Use simple-git ([2c016a7](https://github.com/unhappychoice/mdts/commit/2c016a7)) ([#80](https://github.com/unhappychoice/mdts/pull/80))

### 👍 Improvements
- Improve documents ([a085ba1](https://github.com/unhappychoice/mdts/commit/a085ba1)) ([#77](https://github.com/unhappychoice/mdts/pull/77))
- Rewrite documents ([1de7d91](https://github.com/unhappychoice/mdts/commit/1de7d91)) ([#77](https://github.com/unhappychoice/mdts/pull/77))
- Add markdown_features.md document ([ce32e5a](https://github.com/unhappychoice/mdts/commit/ce32e5a)) ([#77](https://github.com/unhappychoice/mdts/pull/77))
- Add usecases.md document ([02ade13](https://github.com/unhappychoice/mdts/commit/02ade13)) ([#77](https://github.com/unhappychoice/mdts/pull/77))
- Add faq.md document ([221e1d1](https://github.com/unhappychoice/mdts/commit/221e1d1)) ([#77](https://github.com/unhappychoice/mdts/pull/77))
- Add comparison.md ([e60d0e1](https://github.com/unhappychoice/mdts/commit/e60d0e1)) ([#77](https://github.com/unhappychoice/mdts/pull/77))

### 👕 Code Style
- Fix lint ([cb40088](https://github.com/unhappychoice/mdts/commit/cb40088)) ([#80](https://github.com/unhappychoice/mdts/pull/80))

### 💚 CI/Test
- Update tests to reflect host argument in serve function ([ee45252](https://github.com/unhappychoice/mdts/commit/ee45252)) ([#82](https://github.com/unhappychoice/mdts/pull/82))
- Update specs ([3552805](https://github.com/unhappychoice/mdts/commit/3552805)) ([#81](https://github.com/unhappychoice/mdts/pull/81))
- Fix test ([e8a6c39](https://github.com/unhappychoice/mdts/commit/e8a6c39)) ([#80](https://github.com/unhappychoice/mdts/pull/80))

## v0.7.1

### 🐛 Bug Fixes
- Fix version string is not udpated ([246111b](https://github.com/unhappychoice/mdts/commit/246111b)) ([#73](https://github.com/unhappychoice/mdts/pull/73))

## v0.7.0

### ✨ Features
- Show GitHub link and version on header ([11df520](https://github.com/unhappychoice/mdts/commit/11df520)) ([#71](https://github.com/unhappychoice/mdts/pull/71))
- Add --version option to CLI ([2ec2567](https://github.com/unhappychoice/mdts/commit/2ec2567)) ([#71](https://github.com/unhappychoice/mdts/pull/71))
- Configure settings ([4202133](https://github.com/unhappychoice/mdts/commit/4202133)) ([#67](https://github.com/unhappychoice/mdts/pull/67))

### 👍 Improvements
- Add npm run dev command ([51c140a](https://github.com/unhappychoice/mdts/commit/51c140a)) ([#69](https://github.com/unhappychoice/mdts/pull/69))
- Add frontend features documentation ([d11dbb4](https://github.com/unhappychoice/mdts/commit/d11dbb4)) ([#67](https://github.com/unhappychoice/mdts/pull/67))

### ♻️ Refactor
- Refactor frontend ([d0a622a](https://github.com/unhappychoice/mdts/commit/d0a622a)) ([#67](https://github.com/unhappychoice/mdts/pull/67))
- Refactor server module ([2799235](https://github.com/unhappychoice/mdts/commit/2799235)) ([#66](https://github.com/unhappychoice/mdts/pull/66))

### 🚀 Performance
- Optimize livereload logic ([84ec123](https://github.com/unhappychoice/mdts/commit/84ec123)) ([#69](https://github.com/unhappychoice/mdts/pull/69))

### 💚 CI/Test
- Generate CHANGELOG.md ([e32e697](https://github.com/unhappychoice/mdts/commit/e32e697)) ([#72](https://github.com/unhappychoice/mdts/pull/72))
- Update specs ([ae95d1b](https://github.com/unhappychoice/mdts/commit/ae95d1b)) ([#71](https://github.com/unhappychoice/mdts/pull/71))
- Update specs ([eeeacff](https://github.com/unhappychoice/mdts/commit/eeeacff)) ([#69](https://github.com/unhappychoice/mdts/pull/69))
- Update specs ([8e76425](https://github.com/unhappychoice/mdts/commit/8e76425)) ([#67](https://github.com/unhappychoice/mdts/pull/67))
- Update specs ([61423a4](https://github.com/unhappychoice/mdts/commit/61423a4)) ([#66](https://github.com/unhappychoice/mdts/pull/66))

## v0.6.0

### ✨ Features
- Highlight raw markdown ([d257417](https://github.com/unhappychoice/mdts/commit/d257417)) ([#63](https://github.com/unhappychoice/mdts/pull/63))
- Use history to select tabs ([9fb152f](https://github.com/unhappychoice/mdts/commit/9fb152f)) ([#62](https://github.com/unhappychoice/mdts/pull/62))
- Handle frontmatter ([0b2255d](https://github.com/unhappychoice/mdts/commit/0b2255d)) ([#54](https://github.com/unhappychoice/mdts/pull/54))
- Render marmaid diagram ([3899dac](https://github.com/unhappychoice/mdts/commit/3899dac)) ([#53](https://github.com/unhappychoice/mdts/pull/53))

### 🐛 Bug Fixes
- Fix outline don't have unique key ([c509faa](https://github.com/unhappychoice/mdts/commit/c509faa)) ([#56](https://github.com/unhappychoice/mdts/pull/56))

### ♻️ Refactor
- Separate logger ([d082bc4](https://github.com/unhappychoice/mdts/commit/d082bc4)) ([#56](https://github.com/unhappychoice/mdts/pull/56))

### 🆙 Update Packages
- Update package ([9693348](https://github.com/unhappychoice/mdts/commit/9693348))

### 💚 CI/Test
- Update spec ([4663689](https://github.com/unhappychoice/mdts/commit/4663689)) ([#63](https://github.com/unhappychoice/mdts/pull/63))
- Add more frontned tests ([6fc8208](https://github.com/unhappychoice/mdts/commit/6fc8208)) ([#56](https://github.com/unhappychoice/mdts/pull/56))
- Add more tests ([3fddd08](https://github.com/unhappychoice/mdts/commit/3fddd08)) ([#56](https://github.com/unhappychoice/mdts/pull/56))
- Fix coverage is not collected ([048892b](https://github.com/unhappychoice/mdts/commit/048892b)) ([#56](https://github.com/unhappychoice/mdts/pull/56))
- Collect test coverage ([174ee2b](https://github.com/unhappychoice/mdts/commit/174ee2b)) ([#55](https://github.com/unhappychoice/mdts/pull/55))
- Update spec ([d56f04f](https://github.0com/unhappychoice/mdts/commit/d56f04f)) ([#54](https://github.com/unhappychoice/mdts/pull/54))

## v0.5.1

### 🐛 Bug Fixes
- Fix non-ascii named file is not found ([78aed75](https://github.com/unhappychoice/mdts/commit/78aed75)) ([#52](https://github.com/unhappychoice/mdts/pull/52))

## v0.5.0

### ✨ Features
- Persist app state ([d3eba70](https://github.com/unhappychoice/mdts/commit/d3eba70)) ([#50](https://github.com/unhappychoice/mdts/pull/50))
- Persist AppSetting state ([efeb6af](https://github.com/unhappychoice/mdts/commit/efeb6af)) ([#50](https://github.com/unhappychoice/mdts/pull/50))
- Add sample documents ([82a3022](https://github.com/unhappychoice/mdts/commit/82a3022)) ([#48](https://github.com/unhappychoice/mdts/pull/48))
- Handle 404 appropriately ([ce82024](https://github.com/unhappychoice/mdts/commit/ce82024)) ([#48](https://github.com/unhappychoice/mdts/pull/48))
- Handle links in markdowns ([4640657](https://github.com/unhappychoice/mdts/commit/4640657)) ([#48](https://github.com/unhappychoice/mdts/pull/48))

### 👍 Improvements
- Tweak styles ([8b252e4](https://github.com/unhappychoice/mdts/commit/8b252e4)) ([#49](https://github.com/unhappychoice/mdts/pull/49))

### 💚 CI/Test
- Update specs ([ea4e533](https://github.com/unhappychoice/mdts/commit/ea4e533)) ([#50](https://github.com/unhappychoice/mdts/pull/50))
- Update specs ([3c7daef](https://github.com/unhappychoice/mdts/commit/3c7daef)) ([#48](https://github.com/unhappychoice/mdts/pull/48))

## v0.4.5

### 🐛 Bug Fixes
- Fix livereloading ([38c33d4](https://github.com/unhappychoice/mdts/commit/38c33d4))

### 👍 Improvements
- Add redux packages ([b8c8f09](https://github.com/unhappychoice/mdts/commit/b8c8f09)) ([#47](https://github.com/unhappychoice/mdts/pull/47))

### ♻️ Refactor
- Create AppSettings slice ([34e214a](https://github.com/unhappychoice/mdts/commit/34e214a)) ([#47](https://github.com/unhappychoice/mdts/pull/47))
- Refactor ([d41e3ae](https://github.com/unhappychoice/mdts/commit/d41e3ae)) ([#47](https://github.com/unhappychoice/mdts/pull/47))
- Create Outline slice ([9db5c9b](https://github.com/unhappychoice/mdts/commit/9db5c9b)) ([#47](https://github.com/unhappychoice/mdts/pull/47))
- Create FileTree slice ([096dbcb](https://github.com/unhappychoice/mdts/commit/096dbcb)) ([#47](https://github.com/unhappychoice/mdts/pull/47))
- Create Content slice ([be8f51e](https://github.com/unhappychoice/mdts/commit/be8f51e)) ([#47](https://github.com/unhappychoice/mdts/pull/47))

### 🚿 Delete Features
- Delete .js files ([31d985f](https://github.com/unhappychoice/mdts/commit/31d985f)) ([#47](https://github.com/unhappychoice/mdts/pull/47))

### 💚 CI/Test
- Update specs ([d7e88e0](https://github.com/unhappychoice/mdts/commit/d7e88e0)) ([#47](https://github.com/unhappychoice/mdts/pull/47))

## v0.4.4

### 🐛 Bug Fixes
- Fix index.html loads bundle.js twice ([98fcc25](https://github.com/unhappychoice/mdts/commit/98fcc25))

## v0.4.3

### 🐛 Bug Fixes
- Fix welcome.md outline is not found ([5e2cae6](https://github.com/unhappychoice/mdts/commit/5e2cae6))

## v0.4.2

## v0.4.1

### ✨ Features
- Implement file search feature ([5e11669](https://github.com/unhappychoice/mdts/commit/5e11669)) ([#43](https://github.com/unhappychoice/mdts/pull/43))

### 🐛 Bug Fixes
- Fix open is not defined ([9d79fd7](https://github.com/unhappychoice/mdts/commit/9d79fd7))
- Fix entry point ([846537a](https://github.com/unhappychoice/mdts/commit/846537a))

### 👍 Improvements
- Update screenshot.png ([75bf08c](https://github.com/unhappychoice/mdts/commit/75bf08c))

### ♻️ Refactor
- Separate frontend package ([141a293](https://github.com/unhappychoice/mdts/commit/141a293)) ([#39](https://github.com/unhappychoice/mdts/pull/39))

### 👕 Code Style
- Improve style ([328bdaa](https://github.com/unhappychoice/mdts/commit/328bdaa)) ([#42](https://github.com/unhappychoice/mdts/pull/42))

### 💚 CI/Test
- Fix release action ([ba6434d](https://github.com/unhappychoice/mdts/commit/ba6434d))
- Fix release action ([b461da6](https://github.com/unhappychoice/mdts/commit/b461da6))
- Fix release action ([544c50b](https://github.com/unhappychoice/mdts/commit/544c50b))
- Enable eslint ([fe3b4c5](https://github.com/unhappychoice/mdts/commit/fe3b4c5)) ([#42](https://github.com/unhappychoice/mdts/pull/42))
- Add frontend unit tests ([e2e0a8b](https://github.com/unhappychoice/mdts/commit/e2e0a8b)) ([#40](https://github.com/unhappychoice/mdts/pull/40))
- Add e2e tests ([d5351cd](https://github.com/unhappychoice/mdts/commit/d5351cd)) ([#40](https://github.com/unhappychoice/mdts/pull/40))
- Add unit tests ([957dda3](https://github.com/unhappychoice/mdts/commit/957dda3)) ([#40](https://github.com/unhappychoice/mdts/pull/40))
- Add fixture ([2bbce62](https://github.com/unhappychoice/mdts/commit/2bbce62)) ([#40](https://github.com/unhappychoice/mdts/pull/40))
- Add test GitHub action ([1b31849](https://github.com/unhappychoice/mdts/commit/1b31849)) ([#40](https://github.com/unhappychoice/mdts/pull/40))
- Use jest project ([9db298e](https://github.com/unhappychoice/mdts/commit/9db298e)) ([#40](https://github.com/unhappychoice/mdts/pull/40))
- Setup server test environment ([9c4cba1](https://github.com/unhappychoice/mdts/commit/9c4cba1)) ([#40](https://github.com/unhappychoice/mdts/pull/40))
- Setup frontend test environment ([76b291a](https://github.com/unhappychoice/mdts/commit/76b291a)) ([#40](https://github.com/unhappychoice/mdts/pull/40))

## v0.3.2

### 🐛 Bug Fixes
- Fix build ([205e5bb](https://github.com/unhappychoice/mdts/commit/205e5bb))
- Handle watch can failed due to FD limit ([dda7c7f](https://github.com/unhappychoice/mdts/commit/dda7c7f)) ([#33](https://github.com/unhappychoice/mdts/pull/33))

## v0.3.1

### 🐛 Bug Fixes
- Fix package.json ([09f905a](https://github.com/unhappychoice/mdts/commit/09f905a))

## v0.3.0

### ✨ Features
- Implement Breadcrumb ([ecd8639](https://github.com/unhappychoice/mdts/commit/ecd8639)) ([#31](https://github.com/unhappychoice/mdts/pull/31))
- Implement FileTree expand/collapse buttons ([c4e9a7c](https://github.com/unhappychoice/mdts/commit/c4e9a7c)) ([#31](https://github.com/unhappychoice/mdts/pull/31))
- Implement livereload feature ([71a5edd](https://github.com/unhappychoice/mdts/commit/71a5edd)) ([#30](https://github.com/unhappychoice/mdts/pull/30))
- Enable syntax highlighting ([b783303](https://github.com/unhappychoice/mdts/commit/b783303)) ([#31](https://github.com/unhappychoice/mdts/pull/31))
- Use rehype-raw ([e973f69](https://github.com/unhappychoice/mdts/commit/e973f69)) ([#31](https://github.com/unhappychoice/mdts/pull/31))
- Show welcome document ([9b55a71](https://github.com/unhappychoice/mdts/commit/9b55a71)) ([#31](https://github.com/unhappychoice/mdts/pull/31))

### 🐛 Bug Fixes
- Fix loading behavior ([2617807](https://github.com/unhappychoice/mdts/commit/2617807)) ([#32](https://github.com/unhappychoice/mdts/pull/32))
- Fix serving logic ([c74bbe9](https://github.com/unhappychoice/mdts/commit/c74bbe9)) ([#31](https://github.com/unhappychoice/mdts/pull/31))
- Fix express mount ([5f181ec](https://github.com/unhappychoice/mdts/commit/5f181ec)) ([#30](https://github.com/unhappychoice/mdts/pull/30))

### 👍 Improvements
- Tweak design ([d95d7d0](https://github.com/unhappychoice/mdts/commit/d95d7d0)) ([#31](https://github.com/unhappychoice/mdts/pull/31))

### ♻️ Refactor
- Refactor Layout ([45cdc70](https://github.com/unhappychoice/mdts/commit/45cdc70)) ([#31](https://github.com/unhappychoice/mdts/pull/31))
- Refactor api hooks ([737fab1](https://github.com/unhappychoice/mdts/commit/737fab1)) ([#31](https://github.com/unhappychoice/mdts/pull/31))
- Separate App.tsx ([bcd9286](https://github.com/unhappychoice/mdts/commit/bcd9286)) ([#31](https://github.com/unhappychoice/mdts/pull/31))
- Refactor ([23c7c17](https://github.com/unhappychoice/mdts/commit/23c7c17)) ([#30](https://github.com/unhappychoice/mdts/pull/30))

## v0.2.0

### ✨ Features
- Implement outline ([22819be](https://github.com/unhappychoice/mdts/commit/22819be)) ([#23](https://github.com/unhappychoice/mdts/pull/23))

### 👍 Improvements
- Filter out unnecessary directories / files ([f7be8f5](https://github.com/unhappychoice/mdts/commit/f7be8f5)) ([#21](https://github.com/unhappychoice/mdts/pull/21))

### ♻️ Refactor
- Refactor server ([502afe2](https://github.com/unhappychoice/mdts/commit/502afe2)) ([#23](https://github.com/unhappychoice/mdts/pull/23))

## v0.1.7

### 🐛 Bug Fixes
- Fix static file mounting ([09a63e7](https://github.com/unhappychoice/mdts/commit/09a63e7))

## v0.1.6

### 💚 CI/Test
- Add public directory ([0efa00d](https://github.com/unhappychoice/mdts/commit/0efa00d))

## v0.1.5

### 🐛 Bug Fixes
- Fix frontend is not built ([13bebe9](https://github.com/unhappychoice/mdts/commit/13bebe9))

## v0.1.4

### 🐛 Bug Fixes
- Fix .npmignore ([eeb27cd](https://github.com/unhappychoice/mdts/commit/eeb27cd))

## v0.1.3

### 🐛 Bug Fixes
- Fix __dirname is not defined ([dabd51b](https://github.com/unhappychoice/mdts/commit/dabd51b))

## v0.1.2

### 💚 CI/Test
- Use ESM ([fd70031](https://github.com/unhappychoice/mdts/commit/fd70031))

## v0.1.1

### 🐛 Bug Fixes
- Fix bin directory is not staged ([1cc380d](https://github.com/unhappychoice/mdts/commit/1cc380d))

## v0.1.0

### ✨ Features
- Implement basic server ([eeb0be1](https://github.com/unhappychoice/mdts/commit/eeb0be1)) ([#4](https://github.com/unhappychoice/mdts/pull/4))
- Implement CLI ([ded0dd6](https://github.com/unhappychoice/mdts/commit/ded0dd6)) ([#5](https://github.com/unhappychoice/mdts/pull/5))
- Implement basic frontend ([16e1a9b](https://github.com/unhappychoice/mdts/commit/16e1a9b)) ([#6](https://github.com/unhappychoice/mdts/pull/6))
- Use MaterialUI ([f76dfe0](https://github.com/unhappychoice/mdts/commit/f76dfe0)) ([#18](https://github.com/unhappychoice/mdts/pull/18))
- Implement basic UI ([a1a226b](https://github.com/unhappychoice/mdts/commit/a1a226b)) ([#18](https://github.com/unhappychoice/mdts/pull/18))

### 👍 Improvements
- Update package.json ([85f4e5e](https://github.com/unhappychoice/mdts/commit/85f4e5e)) ([#20](https://github.com/unhappychoice/mdts/pull/20))

### 💚 CI/Test
- Add release GitHub Action ([97de253](https://github.com/unhappychoice/mdts/commit/97de253)) ([#20](https://github.com/unhappychoice/mdts/pull/20))
- Fix CI ([d2682d8](https://github.com/unhappychoice/mdts/commit/d2682d8))
