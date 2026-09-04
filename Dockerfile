# docker build --no-cache -t icoretech/airbroke:prod --progress=plain .
# docker run -p 3000:3000 icoretech/airbroke:prod
FROM --platform=$BUILDPLATFORM node:24.12-alpine AS base
ARG DEBUG_TOOLS
ENV NEXT_TELEMETRY_DISABLED=1
ENV CHECKPOINT_DISABLE=1
ENV NODE_ENV=production
RUN apk upgrade --no-cache
RUN apk add --no-cache libc6-compat dumb-init openssl
RUN corepack enable
RUN [ "${DEBUG_TOOLS}" = "true" ] && apk add --no-cache inotify-tools htop net-tools lsof psmisc strace tcpdump || true
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ .yarn/
COPY prisma/ prisma/
RUN yarn install --immutable || (echo "yarn install failed, printing build log(s):" && find /tmp -type f -name "build.log" -exec cat {} \; && exit 1)

FROM base AS migrations-deps
WORKDIR /app/migrations-runtime
COPY migrations-runtime/package.json migrations-runtime/yarn.lock migrations-runtime/.yarnrc.yml ./
COPY migrations-runtime/prisma.config.ts ./prisma.config.ts
RUN yarn install --immutable

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .
RUN yarn build

FROM base AS runner
WORKDIR /app
COPY --from=builder --chown=1001:1001 /app/.next/standalone ./
COPY --from=builder --chown=1001:1001 /app/.next/static ./.next/static
COPY --from=builder --chown=1001:1001 /app/public ./public
COPY --from=builder --chown=1001:1001 /app/prisma ./prisma
COPY --from=builder --chown=1001:1001 /app/prisma.config.ts ./
COPY --from=migrations-deps --chown=1001:1001 /app/migrations-runtime/node_modules ./migrations-runtime/node_modules
COPY --from=builder --chown=1001:1001 /app/prisma/schema.prisma ./migrations-runtime/prisma/schema.prisma
COPY --from=builder --chown=1001:1001 /app/prisma/migrations ./migrations-runtime/prisma/migrations
COPY --chown=1001:1001 migrations-runtime/prisma.config.ts ./migrations-runtime/prisma.config.ts
USER nextjs
RUN cd /app/migrations-runtime && node_modules/.bin/prisma version --json
EXPOSE 3000
CMD ["dumb-init", "node", "server.js"]
