---
id: 10cda3aa3db1d0425715a993270b9841
title: How to configure CircleCI to deploy an application to Heroku using Docker
description: CircleCI is a continuos integration and continuos delivery platform, and Heroku is a clould platform as a service.
createdAt: '2024-06-21'
tags: [english, programming, devops]
slug: how-to-configure-circleci-to-deploy-an-application-to-heroku-using-docker
---

CircleCI is a continuos integration and continuos delivery platform, and Heroku is a clould platform as a service. Knowing this, you can use CircleCI to man
age the delivery of your platform to provider to generate a new deploy for every [git](https://git-scm.com/) push or release.

## Configuring CircleCI for Heroku

> This part requires that you already have an account on CircleCI, a Docker image that builds your application and an account on Heroku with configured application.

Before all, you need generate `$HEROKU_API_KEY`, you can do it by following the Heroku [documentation](https://help.heroku.com/PBGP6IDE/how-should-i-generate-an-api-key-that-allows-me-to-use-the-heroku-platform-api/). To a best practice to store these credentials is creating a [context](https://circleci.com/docs/contexts/) for them.

To configure CircleCI, you need to create a `.circleci/config.yml` file in the root of your project. This file will contain the configuration for deploy your application to Heroku.

After that, you need define Heroku Orb in your `config.yml` file, you can do it by adding the following line:

```diff
version: 2.1
orbs:
+ heroku: circleci/heroku@2.0.0
```

Later, you need to define the step that will be build your Dockerfile and push it to Heroku.

```sh
jobs:
  # Your build job here.
  build: ...

  deploy:
    executor: heroku/default
    steps:
      - attach_workspace:
          at: ~/project

      - setup_remote_docker:
          version: default
          docker_layer_caching: true

      - heroku/install

      - run:
          name: Login to Heroku Docker image registry
          command: heroku container:login

      - run:
          name: Build and push Docker image to Heroku
          command: |

            # Change for your Dockerfile path here.
            cd ~/project

            docker build -f Dockerfile -t ventus .

            heroku container:push web -a $HEROKU_APP_NAME
            heroku container:release web -a $HEROKU_APP_NAME
```

The deploy step will be build your Dockerfile, push it to Heroku and release to your application.

## Conclusion

Integrating CircleCI with Heroku using Docker automates deployments, keeping your application up-to-date. This setup streamlines continuous delivery, reduces manual tasks, and enhances efficiency, allowing you to focus on development while maintaining a reliable deployment process.

## Resources

- [Deploy to Heroku](https://circleci.com/docs/deploy-to-heroku/)
- [circleci/heroku@2.0.0](https://circleci.com/developer/orbs/orb/circleci/heroku)