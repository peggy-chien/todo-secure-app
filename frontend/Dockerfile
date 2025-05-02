# --------- Builder Stage ---------
FROM node:18-alpine AS builder

ARG YARN_VERSION

WORKDIR /app
COPY package.json yarn.lock ./

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

RUN corepack enable \
  && corepack prepare yarn@${YARN_VERSION} --activate \
  && echo "nodeLinker: node-modules" > .yarnrc.yml \
  && yarn install --immutable

COPY . .
RUN yarn install --check-cache \
  && yarn build

# --------- Runtime Stage ---------
FROM nginx:alpine AS runner

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
# uncomment the following line to use custom nginx config
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]