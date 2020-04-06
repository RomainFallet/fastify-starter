# Fastify starter

The purpose of this repository is to provide instructions to create and configure a new [Fastify](https://www.fastify.io/) app from scratch with appropriate linters, editor config, testing utilities, continuous integration on Ubuntu, macOS and Windows.

On Windows, commands are meant to be executed on PowerShell.

## Table of contents

- [Quickstart](#quickstart)
- [Manual configuration](#manual-configuration)
  - [Init the project](#init-the-project)
  - [Install app packages](#install-app-packages)
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
  - [Check coding style](#check-coding-style)
  - [Format code automatically](#format-code-automatically)
  - [Lint code for errors/bad practices](#lint-code-for-errorsbad-practices)
  - [Audit & fix dependencies vulnerabilities](#audit--fix-dependencies-vulnerabilities)
  - [Check & upgrade outdated dependencies](#check--upgrade-outdated-dependencies)

## Quickstart

```bash
git clone https://github.com/RomainFallet/fastify-starter
```

## Manual configuration

### Init the project

```bash
# Define npm prefix
npm config set save-prefix='~'

# Create ./package.json (MacOS & Ubuntu)
echo '{
  "name": "fastify-starter",
  "version": "1.0.0",
  "license": "UNLICENSED",
  "repository": "git@github.com:RomainFallet/fastify-starter.git",
  "scripts": {
    "start": "nodemon ./src/index.js"
  },
  "lint-staged": {
    "./**/*.{js,json}": [
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
}' | tee ./package.json > /dev/null

# Create ./package.json (Windows)
Set-Content ./package.json '{
  "name": "fastify-starter",
  "version": "1.0.0",
  "license": "UNLICENSED",
  "repository": "git@github.com:RomainFallet/fastify-starter.git",
  "scripts": {
    "start": "nodemon ./src/index.js"
  },
  "lint-staged": {
    "./**/*.{js,json}": [
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
}'
```

### Install app packages

```bash
# Install
npm install fastify@~2.13.0 axios@~0.19.0 mongodb@~3.5.0 mongoose@~5.9.0
npm install --save-dev nodemon@~2.0.0

# Configuration (MacOS & Ubuntu)
mkdir ./src
echo "// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

// Declare a route
fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000)
    fastify.log.info(\`server listening on \${fastify.server.address().port}\`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()" | tee ./src/index.js > /dev/null

# Congiguration (Windows)
Set-Content ./src/index.js "// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

// Declare a route
fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000)
    fastify.log.info(\`server listening on \${fastify.server.address().port}\`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()"
```

### Install testing utilities

[Back to top ↑](#table-of-contents)

```bash
npm install --save-dev jest@~25.2.0 axios-mock-adapter@~1.18.0 mongodb-memory-server@~6.5.0
```

### Install Prettier code formatter

[Back to top ↑](#table-of-contents)

```bash
npm install --save-dev prettier@~2.0.0 eslint-plugin-prettier@~3.1.0 eslint-config-prettier@~6.10.0 prettier-config-standard@~1.0.0 eslint-config-prettier-standard@~3.0.0
```

### Install ESLint code linter with StandardJS rules

[Back to top ↑](#table-of-contents)

```bash
# Install
npm install --save-dev eslint@~6.8.0 eslint-plugin-standard@~4.0.0 eslint-plugin-promise@~4.2.0 eslint-plugin-import@~2.20.0 eslint-plugin-node@~11.0.0 eslint-config-standard@~14.1.0

# Configuration (MacOS & Ubuntu)
echo '{
  "extends": [
    "standard",
    "prettier-standard"
  ]
}' | tee ./.eslintrc.json > /dev/null

# Configuration (Windows)
Set-Content ./.eslintrc.json '{
  "extends": [
    "standard",
    "prettier-standard"
  ]
}'
```

### Install dependencies checker

```bash
npm install --save-dev npm-check@~5.9.0
```

### Configure .gitignore

[Back to top ↑](#table-of-contents)

```bash
# Configuration (MacOS & Ubuntu)
echo "# OS Specific
.DS_Store

# Dependencies
node_modules

# Environment
.env.local" | tee ./.gitignore > /dev/null

# Configuration (Windows)
Add-Content ./.gitignore "# OS Specific
.DS_Store

# Dependencies
node_modules

# Environment
.env.local"
```

### Configure .editorconfig

[Back to top ↑](#table-of-contents)

```bash
# Configuration (MacOS & Ubuntu)
echo "# EditorConfig is awesome: https://EditorConfig.org
root = true

[*]
end_of_line = lf
insert_final_newline = true
charset = utf-8
indent_style = space
indent_size = 2
trim_trailing_whitespace = true" | tee ./.editorconfig > /dev/null

# Configuration (Windows)
Set-Content ./.editorconfig "# EditorConfig is awesome: https://EditorConfig.org
root = true

[*]
end_of_line = lf
insert_final_newline = true
charset = utf-8
indent_style = space
indent_size = 2
trim_trailing_whitespace = true"
```

### Configure CI with Git hooks

[Back to top ↑](#table-of-contents)

```bash
npm install --save-dev husky@~4.2.0 lint-staged@~10.1.0
```

### Configure CI with GitHub Actions

[Back to top ↑](#table-of-contents)

```bash
# Lint configuration (MacOS & Ubuntu)
mkdir -p ./.github/workflows
echo "name: Check coding style and lint code

on: ['push', 'pull_request']

jobs:
  lint:
    runs-on: ubuntu-18.04

    steps:
    - uses: actions/checkout@v2
    - name: Install dependencies
      run: npm install
    - name: JavaScript: check coding style and lint with ESLint (Prettier + StandardJS)
      run: npx eslint \"./**/*.js\"
    - name: JSON: check coding style with Prettier
      run: npx prettier --check \"./**/*.json\"" | tee ./.github/workflows/check-lint.yml > /dev/null

# Lint configuration (Windows)
Set-Content ./.github/workflows/check-lint.yml "name: Check coding style and lint code

on: ['push', 'pull_request']

jobs:
  lint:
    runs-on: ubuntu-18.04

    steps:
    - uses: actions/checkout@v2
    - name: Install dependencies
      run: npm install
    - name: JavaScript: check coding style and lint with ESLint (Prettier + StandardJS)
      run: npx eslint \"./**/*.js\"
    - name: JSON: check coding style with Prettier
      run: npx prettier --check \"./**/*.json\""

# Test configuration (MacOS & Ubuntu)
echo "name: Launch unit tests & functional tests

on: ['pull_request']

jobs:
  test:
    runs-on: ubuntu-18.04

    steps:
    - uses: actions/checkout@v2
    - name: Install dependencies
      run: npm install
    - name: Launch test with Jest
      run: npx jest" | tee ./.github/workflows/test.yml > /dev/null

# Test configuration (Windows)
Set-Content ./.github/workflows/test.yml "name: Launch unit tests & functional tests

on: ['pull_request']

jobs:
  test:
    runs-on: ubuntu-18.04

    steps:
    - uses: actions/checkout@v2
    - name: Install dependencies
      run: npm install
    - name: Launch test with Jest
      run: npx jest"
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
npx jest

# Watch mode
npx jest --watch
```

### Check coding style & Lint code for errors/bad practices

[Back to top ↑](#table-of-contents)

```bash
# Check JavaScript with ESLint (Prettier + StandardJS)
npx eslint "./**/*.js"

# Check JSON with Prettier
npx prettier --check "./**/*.json"
```

### Format code automatically

[Back to top ↑](#table-of-contents)

```bash
# Format JavaScript with ESLint (Prettier + StandardJS)
npx eslint --fix "./**/*.js"

# Format JSON with Prettier
npx prettier --write "./**/*.json"
```

### Audit & fix dependencies vulnerabilities

[Back to top ↑](#table-of-contents)

```bash
# Check for known vulnerabilities in dependencies
npm audit

# Install latest patches of all dependences
npm update
```

### Check & upgrade outdated dependencies

[Back to top ↑](#table-of-contents)

```bash
# Check for unused/outdated dependencies
npx npm-check

# Choose interactively which dependency to upgrade
npx npm-check -u
```
