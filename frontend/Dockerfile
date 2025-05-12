# --------- Builder Stage ---------
FROM node:18-alpine AS builder

# Make sure we have the same pnpm version in the package.json file
ARG PNPM_VERSION=10.10.0

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Install pnpm
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

COPY . .
RUN pnpm install --frozen-lockfile \
  && pnpm build

# --------- Runtime Stage ---------
FROM nginx:alpine AS runner

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
# uncomment the following line to use custom nginx config
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]