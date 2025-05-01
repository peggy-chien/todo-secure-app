# Dockerfile

## Why Use Multi-Stage Builds?

| Stage | Function | Reason |
| ----- | -------- | ------ |
| Builder (node:alpine) | Install dependencies, compile TypeScript, build Vite output | Transform source code into production-ready dist/ |
| Runtime (nginx:alpine) | Serve only built static files with Nginx | Smaller image size, no Node/Yarn/Vite, safer deployment |

Benefits:
- Minimal final image size (no source, node_modules, or toolchains)
- Improved security by excluding build tools
- Better build caching due to separation of concerns

## COPY Syntax Comparison

| Syntax | Explanation |
| ------ | ----------- |
| `COPY . .` | Copy all files from build context to current WORKDIR inside container |
| `COPY . /app` | Copy all files into the container path /app |
| `WORKDIR /app + COPY . .` | Equivalent to COPY . /app, just a different expression |

Choose the version you find more readable — both are valid when WORKDIR is correctly set.

## Yarn Install Modes

| Command | Effect |
| ------- | ------ |
| `yarn install` | Installs dependencies, may modify yarn.lock |
| `yarn install --immutable` | Installs only if yarn.lock matches package.json exactly — else fails |

Why use `--immutable` in Docker or CI?
- Prevents accidental version drift
- Enforces lockfile integrity
- Ensures repeatable builds
- Especially useful with Plug’n’Play (PnP) mode

## Production Yarn Strategy

Yarn 4 uses Plug’n’Play (pnp) as default. This works well in development, but for better compatibility during Docker builds (--by yarn.official):

```Dockerfile
RUN echo "nodeLinker: node-modules" > .yarnrc.yml
```

This allows tools like tsc, vite, and others to function correctly inside the container.

## Docker Build Cache Optimization with Yarn

### Recommended Cache Optimization Pattern

```Dockerfile
# Step 1: Copy dependency descriptors only
COPY package.json yarn.lock ./

# Step 2: Install dependencies first (this layer will be cached unless lockfiles change)
RUN corepack enable \
  && corepack prepare yarn@4.1.0 --activate \
  && echo "nodeLinker: node-modules" > .yarnrc.yml \
  && yarn install --immutable

# Step 3: Copy remaining app code
COPY . .

# Step 4: Build project
RUN yarn build
```

This pattern ensures:
- Faster builds: reuses install layer cache if lockfiles haven’t changed
- Predictable builds: avoids re-downloading dependencies on each build
- Clean layering: rebuilds only what’s necessary

### Is It Secure?

Yes — this approach is safe and does not introduce security vulnerabilities.
However, there are a few caveats related to dependency consistency:

| Risk | Cause | Recommendation |
|------|-------|----------------|
| Missing new dependencies | You added a new import in code but didn't update yarn.lock | Run yarn install locally and commit changes |
| Lockfile not updated | Only package.json changed, not yarn.lock | Use --immutable to enforce consistency |
| Stale dependencies in image | Docker cache reused an old install layer | Add --check-cache or hash-check lockfile |

### Extra Safety Step (Optional)

Add a secondary install check during build:

```Dockerfile
RUN yarn install --check-cache \
  && yarn build
```

This ensures:
- No untracked or undeclared dependencies are silently used
- You catch runtime or type errors caused by missing packages early

### Best Practice Summary

| Best Practice | Why |
|---------------|-----|
| Cache yarn install after lockfile COPY only | Faster builds, stable installs |
| Use --immutable | Enforce lockfile accuracy |
| Use --check-cache | Catch undeclared dependencies early |
| Don't COPY .yarn/cache/, .pnp.* into image | Keep context small, avoid PnP issues in Docker |
