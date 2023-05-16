<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/screenshot.png">
    <img src="public/screenshot.png" height="256">
  </picture>
  <h1 align="center">Airbroke</h1>
  <p align="center">Open Source Error Catcher</p>
</p>

<p align="center">
  <a aria-label="Build Status" href="https://github.com/icoretech/airbroke/actions/workflows/build.yml">
    <img alt="" src="https://github.com/icoretech/airbroke/actions/workflows/build.yml/badge.svg">
  </a>
</p>

## Features

Warning: alpha software, use at your own risk.

- :floppy_disk: Based on PostgreSQL
- :globe_with_meridians: Airbrake(tm)-compatible HTTP collector endpoint
- :computer: Modern, React-based frontend for error management
- :rocket: Designed with simplicity at its core
- :wrench: Maintains small database footprint even under heavy data ingestion
- :robot: Ask AI about issues

## Roadmap

- :pencil2: Logo
- :arrow_forward: Replay HTTP exceptions
- :clipboard: Provide cURL command to reproduce HTTP exceptions
- :key: Potential integration of OAuth authentication
- :bar_chart: Charting of error frequency over time
- :recycle: Autodeletion of old errors
- :bell: Implementation of notifications via webhooks
- :lock: Support for issue creation through API for compatible providers
- :link: Support more git providers / issue trackers

## System Requirements

- Node.js 20+ compatible environment
- Minimum of 250MB RAM
- At least 1000 millicores, equivalent to 1 CPU core
- PostgreSQL 15+ database
- 8+ free database connections slots per instance

## Architecture

### Data Collection API

The core of Airbroke is an ingestion endpoint that is compatible with Airbrake. It's built using Next.js 13+ route handlers. In the interest of simplicity, we've sidestepped the use of queue systems. As a result, parsing and transactions currently occur in-band. Even with high traffic volumes, a single instance has demonstrated robust request-per-minute (RPM) performance.

### Frontend

The Airbroke user dashboard utilizes Tailwind CSS, creating a blend of server-rendered and client components for a fluid user experience. Some caching may be in effect to limit excessive database queries, but the emphasis for the frontend remains on maintaining a minimal resource footprint.

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

### Helm

You can deploy Airbroke to Kubernetes using the Helm chart provided in the `helm` folder.
You can install the chart with:

```sh
helm install airbroke ./helm --set postgresql.enabled=false --set pgbouncer.enabled=false
```

You can also use the `helm` folder as a template for your own deployment.
The Helm chart includes a `values.yaml` file with some default values that you can override with your own. It also includes PostgreSQL and pgBouncer charts as optional dependencies.

When using Helm we recommend using a GitOps approach to deploy your application(s), such as [Flux](https://fluxcd.io/).

```yaml
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: airbroke
  namespace: airbroke
spec:
  releaseName: airbroke
  chart:
    spec:
      chart: ./charts/airbroke
      sourceRef:
        kind: GitRepository
        name: flux-system
        namespace: flux-system
  interval: 10m0s
  install:
    remediation:
      retries: 4
  upgrade:
    remediation:
      retries: 4
  values:
    database:
      url: 'postgresql://xxxx:xxxx@pgbouncer.default.svc.cluster.local:5432/airbroke_production?pgbouncer=true&connection_limit=100&pool_timeout=10&application_name=airbroke&schema=public'
      migrations_url: 'postgresql://xxxx:xxxx@postgres-postgresql.postgres.svc.cluster.local:5432/airbroke_production?schema=public'
    web:
      image: ghcr.io/icoretech/airbroke:main-c5d425f-1683936478 # {"$imagepolicy": "flux-system:airbroke"}
      replicaCount: 2
      hpa:
        enabled: true
        maxReplicas: 5
        cpu: 100
      resources:
        requests:
          cpu: 1500m
          memory: 500M
        limits:
          cpu: 1500m
          memory: 500M
      ingress:
        enabled: true
        ingressClassName: nginx
        annotations:
          cert-manager.io/cluster-issuer: letsencrypt
          external-dns.alpha.kubernetes.io/cloudflare-proxied: 'false'
          nginx.ingress.kubernetes.io/configuration-snippet: |
            real_ip_header proxy_protocol;
        hosts:
          - host: airbroke.mydomain.com
            paths:
              - '/'
        tls:
          - hosts:
              - airbroke.mydomain.com
```

Please be aware that the previous example serves as a basic template, and you'll likely need to adjust it to suit your specific requirements. For a comprehensive list of configurable options, please consult the values.yaml file. It's important to note that the image value included above is just a placeholder, and you should substitute it with your desired [image tag](https://github.com/icoretech/airbroke/pkgs/container/airbroke).

For automated image updates, consider utilizing [Flux Image Automation](https://fluxcd.io/docs/guides/image-update/).
Our images are deliberately tagged to facilitate Flux's automatic deployment updates whenever a new image becomes available.

```yaml
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImagePolicy
metadata:
  name: airbroke
  namespace: flux-system
spec:
  imageRepositoryRef:
    name: airbroke
  filterTags:
    pattern: '^main-[a-fA-F0-9]+-(?P<ts>.*)'
    extract: '$ts'
  policy:
    numerical:
      order: asc
```

### Setup

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

This limit can be set in your connection strings

After deployment, you should be able to access your ingress (preferably secured with HTTPS) and start adding projects.
This process will generate an API key that you can use with your Airbrake-compatible clients.
This key, along with other essential information, will be provided to you.

Other options include:

```sh
CORS_ORIGINS="https://airbroke.mydomain.com" # comma separated list of origins, if missing '*' is used
OPENAI_API_KEY="sk-xxxx" # OpenAI API Key
OPENAI_ORGANIZATION="" # OpenAI Organization
```

### About pgBouncer

To optimize your experience with Airbroke, as well as with Postgres overall, we advise integrating pgBouncer into your tech stack in transaction mode. Don't forget to correctly set the connection flags in your DATABASE_URL. This ensures that the connection pooler will be utilized (for example, `?pgbouncer=true&connection_limit=10`) and that the necessary `DEALLOCATE` commands will be executed by Prisma. For more comprehensive information, we recommend reviewing [Prisma's Connection Management documentation](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#external-connection-poolers), which provides insights on external connection poolers.

### About DIRECT_URL

The DIRECT_URL should be configured to establish a direct connection to the database. This is particularly crucial when using pgBouncer, as it enables migrations that cannot be executed through a data proxy. You can find more detailed information about this subject in the [Prisma's guide on configuring pgBouncer](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer).

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ficoretech%2Fairbroke%2Ftree%2Fmain&env=DATABASE_URL,DIRECT_URL&project-name=airbroke&repository-name=airbroke)

While [testing on Vercel](https://nextjs.org/learn/basics/deploying-nextjs-app/platform-details) has not been conducted, Airbroke should be fully compatible.

It's important to keep the following points in mind:

- For optimal performance, ensure your database is located in the same region.
- The endpoints under `/api/*` will be converted into serverless functions, which may introduce potential cold boot time.
- Due to the nature of serverless functions, your database connections will need to pass through a data proxy.
- When deploying with Vercel, migrations will need to be executed during the build step. Use the `prisma migrate deploy` command to apply migrations before Vercel proceeds with the deployment of serverless functions.

Detailed instructions for this process can also be found in the [Prisma deployment guide for Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel#prisma-workflow).

### Frontend Protection

Similar to implementing SSL, or separating the collector path from the frontend one to allow scaling indipendently, we recommend setting up gating at the ingress level, at least until the authentication module is rolled out. If you're considering the implementation of OAuth2 proxies, HTTP Basic authentication, or other similar solutions, please ensure that you whitelist the `/api` endpoints.

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
