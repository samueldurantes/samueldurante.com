---
title: Configurando o ambiente de testes com PostgreSQL, Docker, Vitest e GitHub Actions
date: '2024-08-06'
---

## Criando um novo container para seus testes

Nesta abordagem, não utilizaremos ferramentas que executem o banco de dados em memória. Em vez disso, criaremos um arquivo `docker-compose` que especifica a configuração deste banco de dados.

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

Este é o arquivo básico docker-compose para criar um container simples do PostgreSQL, com as seguintes credenciais:

- `PORT`: A porta que realiza o redirecionamento do Docker é 5433.
- `POSTGRES_USER`: O nome de usuário do PostgreSQL é application-tests (você pode alterar, se desejar).
- `POSTGRES_PASSWORD`: A senha do usuário do PostgreSQL é application-tests-admin (você pode alterar, se desejar).

Após criar este arquivo, você pode executar o seguinte comando para criar o container:

```sh
$ docker-compose up -d
```

Este container será utilizado principalmente para que você possa executar seus testes localmente, além de servir como base para a configuração do PostgreSQL que será criada no nosso container de CI/CD.

## Configurando o Vitest

Para configurar o Vitest, defina as variáveis de ambiente do PostgreSQL no seu arquivo de setup como segue:

```ts
process.env.POSTGRES_URI =
  'postgresql://application-tests:application-tests-admin@localhost:5433/postgres';

// ou

process.env.POSTGRES_HOST = '127.0.0.1';
process.env.POSTGRES_PORT = 5433;
process.env.POSTGRES_USER = 'application-tests';
process.env.POSTGRES_PASSWORD = 'application-tests-admin';
process.env.POSTGRES_DATABASE = 'postgres';
```

Isso garantirá que todos os testes que utilizam o banco de dados apontem para o seu banco de testes.

## Configurando o GitHub Actions para executar o PostgreSQL

### 1. Criando um script para aplicar migrações

Primeiramente, é necessário criar um script que sempre aplicará as migrações necessárias no container do GitHub Actions executando nossos testes. Como o container será encerrado após a execução de todos os testes, o script garante que as migrações sejam aplicadas corretamente.

Você pode usar o seguinte script, que será executado com tsx dentro da action:

```ts
import pg from 'pg';
import fs from 'fs/promises';
import path from 'path';

const client = new pg.Client({
  connectionString:
    'postgresql://application-tests:application-tests-admin@localhost:5433/postgres',
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

    console.log('Migração aplicada com sucesso');
  } catch (error) {
    console.error('Erro ao tentar aplicar a migração', error);
  } finally {
    await client.end();
  }
})();
```

### 2. Criando a configuração do GitHub Action

Esta configuração garante que seu ambiente de teste seja configurado de forma consistente e automática sempre que seus testes forem executados.

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

## Conclusão

Este artigo apresenta como criar um container para testes reproduzíveis, configurar seu Vitest com vários ambientes que apontam para este container e uma moderna configuração de GitHub Action para utilizar no CI/CD com tudo apresentado.
