---
id: 10cda3aa3db1d0425715a993270b9841
title: Setting up tests environment with PostgreSQL, Docker, Vitest, and GitHub Actions
createdAt: '2024-08-06'
tags: [english, programming, testing]
slug: setting-up-tests-environment-vitest-github-actions
---

## Creating a new container for your tests

In this approach, we won't use any tools that run the database in memory, then we will create a docker-compose file that specifies
this database configuration.

```yaml
version: '3.8'

services:
  application-tests:
    image: postgres:latest
    container_name: application-tests
    ports:
      - '5433:5432'
    environment:
      POSTGRES_USER: application-tests
      POSTGRES_PASSWORD: application-tests-admin
    restart: always
```

This is the basic docker-compose file to create a simple PostgreSQL container, with the follow credentials:

- `PORT`: The port that performs Docker fowarding is `5433`.
- `POSTGRES_USER`: The PostgreSQL user name is `application-tests` (You can change, if you want).
- `POSTGRES_PASSWORD`: The PostgreSQL user password is `application-tests-admin` (You can change, if you want).

After creating this file, you can run the follow command to create the container:

```sh
$ docker-compose up -d
```

This container will be used mainly for you to be able to run your tests locally, in addition to serving as a basis for the
PostgreSQL configuration that will be created within our CI/CD container.

## Configuring the Vitest

To configure Vitest, define PostgreSQL's environment variables in your setup file like this:

```js
process.env.POSTGRES_URI =
  'postgresql://application-tests:application-tests-admin@localhost:5433/postgres';

// or

process.env.POSTGRES_HOST = '127.0.0.1';
process.env.POSTGRES_PORT = 5433;
process.env.POSTGRES_USER = 'application-tests';
process.env.POSTGRES_PASSWORD = 'application-tests-admin';
provess.env.POSTGRES_DATABASE = 'postgres';
```

This will ensure that all tests that use the database will point to your test database.

## Configuring the Github Actions to run PostgreSQL

### 1. Creating a script to apply migrations

First of all, it is necessary to create a script that will always apply the necessary migrations within the GitHub Actions container running our tests. Since the container will terminate after all the tests are run, the script ensures the migrations are applied correctly.

You can use the following script, which will be executed with [`tsx`](https://github.com/privatenumber/tsx) within action:

```js
import pg from 'pg';
import fs from 'fs/promises';
import path from 'path';

const client = new pg.Client({
  connectionString:
    'postgresql://application-tests:application-tests-admin@localhost:5433/postgres';
});

client.connect();

(async () => {
  try {
    const contentFile = await fs.readFile(
      path.resolve(
        __dirname,
        '..',
        'schema.sql'
      ),
      { encoding: 'utf-8' }
    );

    await client.query(contentFile);

    console.log('Migration applied successfully');
  } catch (error) {
    console.error('Error when trying to apply the migration', error);
  } finally {
    await client.end();
  }
})();
```

### 2. Creating Github Action configuration

This configuration ensures that your test environment is set up consistently and automatically each time your tests run.

```yaml
name: Tests

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  workflow_dispatch:

jobs:
  install-and-run-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres

        env:
          POSTGRES_USER: application-tests
          POSTGRES_PASSWORD: application-tests-admin
          POSTGRES_DB: postgres

        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5433:5432

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        name: Install pnpm
        with:
          version: 9
          run_install: false

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run PostgreSQL migration
        run: pnpm w scripts/migrateTestDatabase.ts

      - name: Run tests
        run: pnpm test
```

## Conclusion

This blog post presents how to create a container for reproducible tests, configure your Vitest with several environments that point to this
container and a modern Github Action to try in CI/CD using everything presented.
