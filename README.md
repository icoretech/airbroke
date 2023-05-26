<p align="center">
  <img src="public/logo-full.png" height="400">
  <h1 align="center">Open Source Error Catcher</h1>
</p>

<p align="center">
  <a aria-label="Build Status" href="https://github.com/icoretech/airbroke/actions/workflows/build.yml">
    <img alt="" src="https://github.com/icoretech/airbroke/actions/workflows/build.yml/badge.svg">
  </a>
</p>

## Features

Please keep in mind that Airbroke is currently in active development, and using it in production environments is at your own discretion. We appreciate your feedback and support as we work towards a stable release.

- :floppy_disk: Based on PostgreSQL
- :globe_with_meridians: Airbrake(tm)-compatible HTTP collector endpoint
- :computer: Modern, React-based frontend for error management
- :rocket: Designed with simplicity at its core
- :wrench: Maintains small database footprint even under heavy data ingestion
- :robot: Ask AI about issues
- :clipboard: Provide cURL command to reproduce HTTP exceptions
- :arrow_forward: Replay HTTP exceptions
- :key: Supports multiple OAuth providers for secure user authentication
- :bar_chart: Occurrence charts

## Roadmap

- [ ] Auto-deletion feature for outdated errors
- [ ] Addition of webhook-based notifications
- [ ] Enabling issue reporting through APIs
- [ ] Broadening support for more Git providers and issue trackers

## System Requirements

- Node.js 20+ compatible environment
- Minimum of 250MB RAM
- At least 1000 millicores, equivalent to 1 CPU core
- PostgreSQL 15+ database
- 8+ free database connections slots per instance

## Deployment Options

Airbroke provides flexibility in deployment options. You can either deploy it from the built source code or use a multiarch Docker image. For Kubernetes deployments, a Helm chart is provided. As Airbroke is a Next.js 13 application, it can be deployed wherever a Node.js server is supported. This includes managed environments such as Vercel, Netlify, and Heroku.

### Build from source

For a production build, you can run:

```sh
cp .env.dist .env
```

Then edit the `.env` file to set your own values.

```sh
yarn install
yarn build
```

This will generate a `build` folder that you can deploy to your server, but please refer to the `Dockerfile` to learn more about what to do after that because you might need to copy over some assets.

You can also run `yarn start` to test the production build locally on port `3000`.

### Docker

We publish images for both `amd64` and `arm64` architectures on [ghcr.io](https://github.com/icoretech/airbroke/pkgs/container/airbroke) but in case you want to build your own image you can do so.

You can build the Docker image with:

```sh
docker build --no-cache -t icoretech/airbroke:latest .
```

You can then run the image locally with:

```sh
docker run -p 3000:3000 icoretech/airbroke:latest
```

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ficoretech%2Fairbroke%2Ftree%2Fmain&env=DATABASE_URL,DIRECT_URL,NEXTAUTH_SECRET&project-name=airbroke&repository-name=airbroke)

While [testing on Vercel](https://nextjs.org/learn/basics/deploying-nextjs-app/platform-details) has not been conducted, Airbroke should be fully compatible.

It's important to keep the following points in mind:

- For optimal performance, ensure your database is located in the same region.
- The endpoints under `/api/*` will be converted into serverless functions, which may introduce potential cold boot time.
- Due to the nature of serverless functions, your database connections will need to pass through a data proxy.
- When deploying with Vercel, migrations will need to be executed during the build step. Use the `prisma migrate deploy` command to apply migrations before Vercel proceeds with the deployment of serverless functions.

Detailed instructions for this process can also be found in the [Prisma deployment guide for Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel#prisma-workflow).

### Render.com

[![Deploy with Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/icoretech/airbroke)

### Helm

You can deploy Airbroke to Kubernetes using the dedicated Helm chart.

The Helm chart includes a `values.yaml` file with some default values that you can override with your own. It also includes a pgBouncer chart as optional dependency.

When using Helm we recommend using a GitOps approach to deploy your application(s), such as [Flux](https://fluxcd.io/).

Please find more information about the Helm chart in the dedicated repository: [icoretech/charts](https://github.com/icoretech/helm/tree/main/charts/airbroke)

### Docker Compose

For users who prefer Docker Compose for managing multi-container Docker applications, a `docker-compose.yml` file is provided at the root of the repository.

To get started, make sure you have Docker and Docker Compose installed on your system. Then, you can start the application using the following command in the terminal:

```sh
make build
make run
```

You can override the default values in the `docker-compose.yml` file by creating a `docker-compose.override.yml` file in the same directory. This file is ignored by Git and will not be committed to the repository.

### OpenNext

For deploying on AWS beside Amplify you might want to use [OpenNext](https://github.com/serverless-stack/open-next) which is a Serverless Framework plugin for deploying Next.js applications on AWS.

## Setup

Please view all the available configuration variables in the [`.env.dist`](https://github.com/icoretech/airbroke/blob/main/.env.dist) file.

Airbroke requires some environment variables set at runtime, `DATABASE_URL` and `DIRECT_URL` are mandatory, some examples:

```sh
# Example Connection to Prisma Data Proxy
DATABASE_URL="prisma://__HOST__/?api_key=__KEY__"
# Example Connection to pgBouncer
DATABASE_URL="postgresql://__USER__:__PASSWORD__@__HOST__:__PORT__/__DATABASE__?pgbouncer=true&connection_limit=100&pool_timeout=10&application_name=airbroke&schema=public"
# Example Connection to PostgreSQL
DATABASE_URL="postgresql://__USER__:__PASSWORD__@__HOST__:__PORT__/__DATABASE__?connection_limit=20&pool_timeout=10&application_name=airbroke&schema=public"

# Direct connection to the database, used for migrations
DIRECT_URL="postgresql://__USER__:__PASSWORD__@__HOST__:__PORT__/__DATABASE__"
```

The optimal connection pool size without pgBouncer (`connection_limit`) can be calculated using the following formula:

```ruby
connection_limit = (num_physical_cpus * 2 + 1) ÷ number_of_application_instances
```

For a system with 8 CPU cores and 3 application instances, the calculation would proceed as follows:

```ruby
connection_limit = (8 * 2 + 1) ÷ 3
connection_limit = (16 + 1) ÷ 3
connection_limit = 17 ÷ 3
connection_limit ≈ 5.67
```

Since `connection_limit` must be an integer, it should be rounded down to the nearest whole number. In this scenario, each of the 3 application instances should have a `connection_limit` of `5`.

This limit can be set in your connection strings.

After deployment, you should be able to access your ingress (preferably secured with HTTPS) and start adding projects.
This process will generate an API key that you can use with your Airbrake-compatible clients.
This key, along with other essential information, will be provided to you.

### About pgBouncer

To optimize your experience with Airbroke, as well as with Postgres overall, we advise integrating pgBouncer into your tech stack in transaction mode. Don't forget to correctly set the connection flags in your DATABASE_URL. This ensures that the connection pooler will be utilized (for example, `?pgbouncer=true&connection_limit=10`) and that the necessary `DEALLOCATE` commands will be executed by Prisma. For more comprehensive information, we recommend reviewing [Prisma's Connection Management documentation](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#external-connection-poolers), which provides insights on external connection poolers.

### About DIRECT_URL

The DIRECT_URL should be configured to establish a direct connection to the database. This is particularly crucial when using pgBouncer, as it enables migrations that cannot be executed through a data proxy. You can find more detailed information about this subject in the [Prisma's guide on configuring pgBouncer](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer).

## Architecture

### Data Collection API

The core of Airbroke is an ingestion endpoint that is compatible with Airbrake. It's built using Next.js 13+ route handlers. In the interest of simplicity, we've sidestepped the use of queue systems. As a result, parsing and transactions currently occur in-band. Even with high traffic volumes, a single instance has demonstrated robust request-per-minute (RPM) performance.

### Frontend

The Airbroke user dashboard utilizes Tailwind CSS, creating a blend of server-rendered and client components for a fluid user experience. Some caching may be in effect to limit excessive database queries, but the emphasis for the frontend remains on maintaining a minimal resource footprint.

## Best Practices for Efficient Error Collection and Storage

In situations where your exceptions include dynamic information as part of the exception itself (e.g., `raise(NotFound, 'no record 1234')`), consider the following strategies:

- If these exceptions are generated within your own code, consider using a more generic error message and provide detailed reporting by sending the exception data in `params` instead:

```ruby
begin
  data = { book_id: 22 }
  raise 'ugh' # no dynamic data
rescue => e
  Airbrake.notify(e, data) # ugh happened on book_id 22
end
```

- If these exceptions are produced by libraries, consider collecting, then wrapping these exceptions and re-raise them with cleaned-up messages, as described in the point above.

Adopting these practices will ensure that Airbroke can maintain an efficient database and effectively group and display related errors.

![Alt](https://repobeats.axiom.co/api/embed/48f60fbfcf724565f4ef697ad425de802c52fd28.svg 'Repobeats analytics image')
