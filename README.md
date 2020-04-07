# Fastify starter

The purpose of this repository is to provide instructions to create and configure a new [Fastify](https://www.fastify.io/) app from scratch with appropriate linters, editor config, testing utilities, continuous integration on Ubuntu, macOS and Windows.

On Windows, commands are meant to be executed on PowerShell.

## Table of contents

- [Quickstart](#quickstart)
- [Manual configuration](#manual-configuration)
  - [Init the project](#init-the-project)
  - [Install app](#install-app)
  - [Install testing utilities](#install-testing-utilities)
  - [Install Prettier code formatter](#install-prettier-code-formatter)
  - [Install ESLint code linter with StandardJS rules](#install-eslint-code-linter-with-standardjs-rules)
  - [Install dependencies checker](#install-dependencies-checker)
  - [Configure .gitignore](#configure-gitignore)
  - [Configure .editorconfig](#configure-editorconfig)
  - [Configure CI with Git hooks](#configure-ci-with-git-hooks)
  - [Configure CI with GitHub Actions](#configure-ci-with-github-actions)
- [Usage](#usage)
  - [Launch app](#launch-app)
  - [Launch unit tests & functional tests](#launch-unit-tests--functional-tests)
  - [Check coding style & Lint code for errors/bad practices](#check-coding-style--lint-code-for-errorsbad-practices)
  - [Format code automatically](#format-code-automatically)
  - [Audit & fix dependencies vulnerabilities](#audit--fix-dependencies-vulnerabilities)
  - [Check & upgrade outdated dependencies](#check--upgrade-outdated-dependencies)

## Quickstart

```bash
git clone https://github.com/RomainFallet/fastify-starter
```

## Manual configuration

### Init the project

[Back to top ↑](#table-of-contents)

Define npm prefix:

```bash
npm config set save-prefix='~'
```

Create a new "./package.json" file:

```json
{
  "name": "fastify-starter",
  "version": "1.0.0",
  "license": "UNLICENSED",
  "repository": "git@github.com:RomainFallet/fastify-starter.git",
  "scripts": {
    "start": "nodemon ./src/index.js",
    "test": "jest",
    "deps:check": "npm-check",
    "deps:upgrade": "npm-check -u",
    "lint:json": "prettier --check \"./**/*.json\"",
    "lint:js": "eslint \"./**/*.js\"",
    "format:json": "prettier --write \"./**/*.json\"",
    "format:js": "eslint --fix \"./**/*.js\""
  },
  "lint-staged": {
    "./**/*.json": [
      "prettier --check"
    ],
    "./**/*.js": [
      "eslint"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  }
}
```

### Install app

[Back to top ↑](#table-of-contents)

Install packages:

```bash
npm install fastify@~2.13.0 axios@~0.19.0 mongodb@~3.5.0 mongoose@~5.9.0
npm install --save-dev nodemon@~2.0.0
```

Create a new "./src/index.js" file:

```javascript
const app = require('./app')

// Run the server!
const start = async () => {
  try {
    await app.listen(3000)
    app.log.info(`server listening on ${app.server.address().port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
```

Create a new file "./src/app.js":

```javascript
// Require the framework and instantiate it
const app = require('fastify')({
  logger: process.env.NODE_ENV === 'prod '
})

// Declare a route
app.get('/', async (request, res) => {
  return { hello: 'world' }
})

module.exports = app
```

### Install testing utilities

[Back to top ↑](#table-of-contents)

Install packages:

```bash
npm install --save-dev jest@~25.2.0 axios-mock-adapter@~1.18.0 mongodb-memory-server@~6.5.0
```

Create a new "./src/app.test.js" file:

```javascript
const app = require('./app')

describe('action GET /', () => {
  it('responds 200 with hello world', async () => {
    // Arrange
    expect.assertions(2)

    // Act
    const res = await app.inject({
      method: 'GET',
      url: '/'
    })

    // Assert
    expect(res.statusCode).toBe(200)
    expect(res.json()).toStrictEqual({
      hello: 'world'
    })
  })
})
```

### Install Prettier code formatter

[Back to top ↑](#table-of-contents)

```bash
npm install --save-dev prettier@~2.0.0 eslint-plugin-prettier@~3.1.0 eslint-config-prettier@~6.10.0 prettier-config-standard@~1.0.0 eslint-config-prettier-standard@~3.0.0
```

### Install ESLint code linter with StandardJS rules

[Back to top ↑](#table-of-contents)

```bash
npm install --save-dev eslint@~6.8.0 eslint-plugin-standard@~4.0.0 eslint-plugin-promise@~4.2.0 eslint-plugin-import@~2.20.0 eslint-plugin-node@~11.0.0 eslint-config-standard@~14.1.0 eslint-plugin-jest@~23.8.0
```

Create a new "./.eslintrc.json" file:

```json
{
  "extends": ["plugin:jest/all", "standard", "prettier-standard"],
  "plugins": ["jest"]
}
```

### Install dependencies checker

[Back to top ↑](#table-of-contents)

```bash
npm install --save-dev npm-check@~5.9.0
```

### Configure .gitignore

[Back to top ↑](#table-of-contents)

Create a new "./.gitignore" file:

```bash
# OS Specific
.DS_Store

# Dependencies
node_modules

# Environment
.env.local
```

### Configure .editorconfig

[Back to top ↑](#table-of-contents)

Create a new "./.editorconfig " file:

```bash
# EditorConfig is awesome: https://EditorConfig.org
root = true

[*]
end_of_line = lf
insert_final_newline = true
charset = utf-8
indent_style = space
indent_size = 2
trim_trailing_whitespace = true
```

### Configure CI with Git hooks

[Back to top ↑](#table-of-contents)

```bash
npm install --save-dev husky@~4.2.0 lint-staged@~10.1.0
```

### Configure CI with GitHub Actions

[Back to top ↑](#table-of-contents)

Create a new "./.github/workflows/lint.yml" file:

```yaml
name: Check coding style and lint code

on: ['push', 'pull_request']

jobs:
  lint-json:
    runs-on: ubuntu-18.04

    steps:
    - uses: actions/checkout@v2
    - name: Install dependencies
      run: npm install
    - name: "JSON: check coding style with Prettier"
      run: npm run lint:json
  lint-js:
    runs-on: ubuntu-18.04

    steps:
    - uses: actions/checkout@v2
    - name: Install dependencies
      run: npm install
    - name: "JavaScript: check coding style and lint with ESLint (Prettier + StandardJS)"
      run: npm run lint:js
```

Create a new "./.github/workflows/test.yml" file:

```yaml
name: Launch unit tests & functional tests

on: ['pull_request']

jobs:
  test:
    runs-on: ubuntu-18.04

    steps:
    - uses: actions/checkout@v2
    - name: Install dependencies
      run: npm install
    - name: Launch test with Jest
      run: npm run test
```

## Usage

### Launch app

[Back to top ↑](#table-of-contents)

```bash
npm start
```

### Launch unit tests & functional tests

[Back to top ↑](#table-of-contents)

```bash
# One-time mode
npm test

# Watch mode
npm test -- --watch
```

### Check coding style & Lint code for errors/bad practices

[Back to top ↑](#table-of-contents)

```bash
# Check JavaScript with ESLint (Prettier + StandardJS)
npm run lint:js

# Check JSON with Prettier
npm run lint:json
```

### Format code automatically

[Back to top ↑](#table-of-contents)

```bash
# Format JavaScript with ESLint (Prettier + StandardJS)
npm run format:js

# Format JSON with Prettier
npm run format:json
```

### Audit & fix dependencies vulnerabilities

[Back to top ↑](#table-of-contents)

```bash
# Check for known vulnerabilities in dependencies
npm audit

# Install latest patches of all dependencies
npm update
```

### Check & upgrade outdated dependencies

[Back to top ↑](#table-of-contents)

```bash
# Check for unused/outdated dependencies
npm run deps:check

# Choose interactively which dependency to upgrade
npm run deps:upgrade
```
