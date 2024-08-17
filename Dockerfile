# docker build --no-cache -t icoretech/airbroke:latest .
# docker run -p 3000:3000 icoretech/airbroke:latest
ARG DEBUG_TOOLS

FROM --platform=$BUILDPLATFORM node:22.0-alpine AS builder
ENV NEXT_TELEMETRY_DISABLED=1
ENV CHECKPOINT_DISABLE=1

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY . .
RUN yarn install --immutable
RUN yarn build

FROM --platform=$BUILDPLATFORM node:22.0-alpine AS runner
ARG DEBUG_TOOLS

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV CHECKPOINT_DISABLE=1

# debug cache filesystem in a live env, to be removed
# inotifywait -m -r -e create,modify,delete /app
RUN [ "${DEBUG_TOOLS}" = "true" ] && apk add --no-cache inotify-tools htop net-tools lsof psmisc strace tcpdump || true

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=1001:1001 /app/.next/standalone ./
COPY --from=builder --chown=1001:1001 /app/.next/static ./.next/static
COPY --from=builder --chown=1001:1001 /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
