# --------- Builder Stage ---------
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json yarn.lock ./

RUN corepack enable \
  && corepack prepare yarn@4.1.0 --activate \
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