# Fastify starter

The purpose of this repository is to provide instructions to create
and configure a new [Fastify](https://www.fastify.io/) app from scratch
with appropriate linters, editor config, testing utilities,
continuous integration on Ubuntu, macOS and Windows.

On Windows, commands are meant to be executed on PowerShell.

## Table of contents

- [Quickstart](#quickstart)
- [Manual configuration](#manual-configuration)
  - [Init the project](#init-the-project)
  - [Install app](#install-app)
  - [Install Jest testing utilities](#install-jest-testing-utilities)
  - [Install Prettier code formatter](#install-prettier-code-formatter)
  - [Install ESLint code linter with StandardJS rules](#install-eslint-code-linter-with-standardjs-rules)
  - [Install MarkdownLint](#install-markdownlint)
  - [Install npm-check dependencies checker](#install-dependencies-checker)
  - [Install dotenv-flow](#install-dotenv)
  - [Configure .gitignore](#configure-gitignore)
  - [Configure .editorconfig](#configure-editorconfig)
  - [Configure CI with Git hooks](#configure-ci-with-git-hooks)
  - [Configure CI with GitHub Actions](#configure-ci-with-github-actions)
  - [Integrate formatters, linters & syntax to VSCode](#integrate-formatter--linter-to-vscode)
- [Usage](#usage)
  - [Launch app](#launch-app)
  - [Launch unit tests](#launch-unit-tests)
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
    "test": "jest --onlyChanged --watch",
    "test:all": "jest --all",
    "deps:check": "npm-check",
    "deps:upgrade": "npm-check -u",
    "lint": "npm-run-all lint:*",
    "lint:js": "eslint \"./**/*.js\"",
    "lint:json": "prettier --check \"./**/*.json\"",
    "lint:md": "markdownlint \"./**/*.md\" --ignore ./node_modules",
    "lint:yml": "prettier --check \"./**/*.yml\"",
    "format": "npm-run-all format:*",
    "format:json": "prettier --write \"./**/*.json\"",
    "format:js": "eslint --fix \"./**/*.js\"",
    "format:md": "markdownlint --fix \"./**/*.md\" --ignore ./node_modules",
    "format:yml": "prettier --write \"./**/*.yml\""
  },
  "lint-staged": {
    "./**/*.json": [
      "prettier --check"
    ],
    "./**/*.js": [
      "eslint"
    ],
    "./**/*.yml": [
      "prettier --check"
    ],
    "./**/*.md": [
      "markdownlint --ignore ./node_modules"
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
# Dependencies
npm install fastify@~2.13.0 axios@~0.19.0 mongodb@~3.5.0 mongoose@~5.9.0 dotenv-flow@~3.1.0

# Dev dependencies
npm install --save-dev nodemon@~2.0.0 npm-run-all@~4.1.5
```

Create a new "./src/index.js" file:

```javascript
require("dotenv-flow").config();
const mongoose = require("mongoose");
const app = require("fastify")({
  logger: true,
});

const start = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Register routes
    app.register(require("./routes/cats"));

    // Start the webserver
    await app.listen(3000);

    app.log.info(`server listening on ${app.server.address().port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
```

Create a new file "./src/routes/cats.js":

```javascript
const Cat = require("../models/cat");

module.exports = async (app) => {
  app.get("/cats", async () => {
    const cats = await Cat.find({});
    return cats.map((cat) => cat.toJSON());
  });

  app.post("/cats", async (req, res) => {
    await Cat.create(req.body);
    res.status(204);
  });
};
```

Create a new file "./src/models/cat.js":

```javascript
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: String,
  color: String,
});

module.exports = mongoose.model("Cat", schema);
```

Create a new file "./.env":

```text
MONGODB_URI=mongodb://<username>:<password>@localhost:27017/<database>
```

### Install Jest testing utilities

[Back to top ↑](#table-of-contents)

Install packages:

```bash
npm install --save-dev jest@~25.2.0 axios-mock-adapter@~1.18.0 mongodb-memory-server@~6.5.0
```

Create a new "./jest.config.js" file:

```javascript
module.exports = {
  testEnvironment: "node",
};
```

Create a new "./src/helpers/test-utils.js":

```javascript
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

const setupMongo = async () => {
  const mongoServer = new MongoMemoryServer();
  await mongoose.connect(await mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return mongoServer;
};
const cleanMongo = async (mongoServer) => {
  await mongoose.disconnect();
  await mongoServer.stop();
};

module.exports = { setupMongo, cleanMongo };
```

Create a new "./src/routes/cat.test.js" file:

```javascript
const app = require("fastify")();
const { setupMongo, cleanMongo } = require("../helpers/test-utils");
const Cat = require("../models/cat");
const mongoose = require("mongoose");

describe("/cats", () => {
  let mongoServer;
  beforeAll(async () => {
    app.register(require("./cats"));
    mongoServer = await setupMongo();
  });

  afterAll(async () => {
    await cleanMongo(mongoServer);
    await app.close();
  });

  describe("GET /cats", () => {
    it("responds 200 and return cats", async () => {
      // Arrange
      expect.assertions(2);
      await Cat.deleteMany({});
      await Cat.create({ name: "Meow", color: "dark" });

      // Act
      const res = await app.inject({
        method: "GET",
        url: "/cats",
      });

      // Assert
      expect(res.statusCode).toBe(200);
      expect(res.json()).toStrictEqual([
        {
          _id: expect.any(String),
          __v: 0,
          name: "Meow",
          color: "dark",
        },
      ]);
    });
  });

  describe("POST /cats", () => {
    it("responds 204 and save cat", async () => {
      // Arrange
      expect.assertions(3);
      await Cat.deleteMany({});

      // Act
      const res = await app.inject({
        method: "POST",
        url: "/cats",
        body: { name: "Meow", color: "dark" },
      });

      // Assert
      expect(res.statusCode).toBe(204);
      expect(res.body).toBe("");
      expect((await Cat.findOne({ name: "Meow" })).toObject()).toStrictEqual({
        _id: expect.any(mongoose.Types.ObjectId),
        __v: 0,
        color: "dark",
        name: "Meow",
      });
    });
  });
});
```

### Install Prettier code formatter

[Back to top ↑](#table-of-contents)

```bash
# Install Prettier with StandardJS config
npm i -D prettier@~2.0.0 prettier-config-standard@~1.0.0

# Install configs for ESLint integration
npm i -D eslint-plugin-prettier@~3.1.0 eslint-config-prettier@~6.10.0 eslint-config-prettier-standard@~3.0.0
```

### Install ESLint code linter with StandardJS rules

[Back to top ↑](#table-of-contents)

```bash
# Install ESLint
npm i -D eslint@~6.8.0

# Install ESLint default plugins
npm i -D eslint-plugin-promise@~4.2.0 eslint-plugin-import@~2.20.0 eslint-plugin-node@~11.1.0

# Install StandardJS & Jest plugins
npm i -D eslint-plugin-standard@~4.0.0 eslint-plugin-jest@~23.8.0

# Install StandardJS config
npm i -D eslint-config-standard@~14.1.0
```

Create a new "./.eslintrc.json" file:

```json
{
  "extends": ["plugin:jest/all", "standard", "prettier-standard"],
  "plugins": ["jest"],
  "rules": {
    "jest/lowercase-name": [
      "error",
      {
        "allowedPrefixes": ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"]
      }
    ],
    "jest/no-hooks": 0
  }
}
```

### Install MarkdownLint

[Back to top ↑](#table-of-contents)

```bash
npm install --save-dev markdownlint@~0.19.0 markdownlint-cli@~0.22.0
```

Create a new "./.markdownlint.json" file:

```json
{
  "default": true
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

on: ["push", "pull_request"]

jobs:
  lint:
    runs-on: ubuntu-18.04

    steps:
      - uses: actions/checkout@v2
      - name: Cache node modules
        uses: actions/cache@v1
        env:
          cache-name: cache-node-modules
        with:
          path: ./node_modules
          key: ${{ env.cache-name }}-${{ hashFiles('./package-lock.json') }}
          restore-keys: ${{ env.cache-name }}-
      - name: Install dependencies
        run: npm install
      - name: Check coding style and lint code
        run: npm run lint
```

Create a new "./.github/workflows/test.yml" file:

```yaml
name: Launch unit tests & functional tests

on: ["pull_request"]

jobs:
  test:
    runs-on: ubuntu-18.04

    steps:
      - uses: actions/checkout@v2
      - name: Cache node modules
        uses: actions/cache@v1
        env:
          cache-name: cache-node-modules
        with:
          path: ./node_modules
          key: ${{ env.cache-name }}-${{ hashFiles('./package-lock.json') }}
          restore-keys: ${{ env.cache-name }}-
      - name: Install dependencies
        run: npm install
      - name: Launch test with Jest
        run: npm run test:all
```

### Integrate formatter & linter to VSCode

Create a new "./.vscode/extensions.json" file:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "davidanson.vscode-markdownlint",
    "me-dutour-mathieu.vscode-github-actions",
    "mikestead.dotenv",
    "editorconfig.editorconfig",
    "eg2.vscode-npm-script"
  ]
}
```

This will suggest to install
[npm](https://marketplace.visualstudio.com/items?itemName=eg2.vscode-npm-script),
[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode),
[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint),
[MarkdownLint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint),
[Github Actions](https://marketplace.visualstudio.com/items?itemName=me-dutour-mathieu.vscode-github-actions),
[DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv)
and [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
extensions to everybody opening this project in VSCode.

Then, create a new "./.vscode/settings.json" file:

```json
{
  "eslint.enable": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.markdownlint": true
  },
  "editor.formatOnSave": true,
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "prettier.disableLanguages": ["javascript", "markdown"]
}
```

This will format automatically the code on save.

## Usage

### Launch app

[Back to top ↑](#table-of-contents)

```bash
npm start
```

### Launch unit tests

[Back to top ↑](#table-of-contents)

```bash
# Test only changes since last commit in watch mode
npm test

# Run all test suite
npm test:all
```

### Check coding style & Lint code for errors/bad practices

[Back to top ↑](#table-of-contents)

```bash
# Check all files
npm run lint

# Check JavaScript with ESLint (Prettier + StandardJS)
npm run lint:js

# Check JSON with Prettier
npm run lint:json

# Check YAML with Prettier
npm run lint:yml

# Check Mardkown with MarkdownLint
npm run lint:md
```

### Format code automatically

[Back to top ↑](#table-of-contents)

```bash
# Check all files
npm run format

# Format JavaScript with ESLint (Prettier + StandardJS)
npm run format:js

# Format JSON with Prettier
npm run format:json

# Format YAML with Prettier
npm run lint:yml

# Format Mardkown with MarkdownLint
npm run lint:md
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
