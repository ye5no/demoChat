# Demo chat

# Getting Started

### Require
* NodeJS version >= 8.9
* MongoDB

### Install
1. `git clone` this repo
2. `npm install`
3. configure yamls in `config` dir. There is `development.example.yaml` for edit.

### Run
Environments run:
* development: `npm run development`
* staging:
    - make dir build
    - `npm run build` || `npm run buildWin`
    - `npm run staging` || `npm run stagingWin`
* production:
    - make dir build
    - `npm run build` || `npm run buildWin`
    - `npm run production` || `npm run productionWin`

### Usage
Development. Server running on 127.0.0.1:7000
