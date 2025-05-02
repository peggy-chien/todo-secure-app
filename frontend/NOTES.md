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
- Especially useful with Plug'n'Play (PnP) mode

## Production Yarn Strategy

Yarn 4 uses Plug'n'Play (pnp) as default. This works well in development, but for better compatibility during Docker builds (--by yarn.official):

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
- Faster builds: reuses install layer cache if lockfiles haven't changed
- Predictable builds: avoids re-downloading dependencies on each build
- Clean layering: rebuilds only what's necessary

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

# ReactJS Learning Notes

## Project Structure and File Organization

### Core Files and Their Purposes

| File | Purpose | Why It's Important |
|------|---------|-------------------|
| `main.tsx` | Application entry point | Initializes React application, sets up root component |
| `App.tsx` | Root component | Main application component that serves as the container |
| `index.css` | Global styles | Applies base styles across the entire application |
| `vite-env.d.ts` | TypeScript declarations | Provides type definitions for Vite-specific features |

### Directory Structure

| Directory | Purpose | Best Practices |
|-----------|---------|----------------|
| `src/components/` | Reusable UI components | Keep components small and focused |
| `src/models/` | TypeScript interfaces/types | Define data structures and types |
| `src/services/` | API and business logic | Separate concerns from UI components |
| `src/styles/` | CSS/SCSS files | Organize styles by component or feature |
| `src/assets/` | Static resources | Store images, fonts, and other static files |

## Component Design Principles

### Naming Conventions

1. **Component Files**
   - Use PascalCase for component files: `TodoList.tsx`
   - Match component name with file name
   - Use `.tsx` extension for TypeScript React components

2. **Component Names**
   - Use PascalCase for component names: `const TodoList = () => {}`
   - Use descriptive names that indicate purpose
   - Prefix with feature/domain when needed: `UserProfile`, `TodoItem`

3. **Props and State**
   - Use camelCase for props and state variables
   - Prefix boolean props with `is`, `has`, or `should`: `isCompleted`
   - Use descriptive names that indicate purpose: `onDelete`, `handleClick`

## React Design Patterns and Best Practices

### 1. Component Composition

React encourages composition over inheritance. This means:
- Break down complex UIs into smaller, reusable components
- Use props to pass data and callbacks
- Keep components focused on a single responsibility

### 2. State Management

- Use `useState` for local component state
- Use `useEffect` for side effects and data fetching
- Consider context or state management libraries for global state

### 3. Props and Data Flow

- Props should flow down the component tree
- Use callbacks to communicate up the tree
- Keep props minimal and focused

### 4. TypeScript Integration

- Define interfaces for props and state
- Use type checking to catch errors early
- Leverage TypeScript's type inference

## Why React Uses This Design

1. **Component-Based Architecture**
   - Promotes reusability and maintainability
   - Makes code more testable
   - Enables better separation of concerns

2. **Unidirectional Data Flow**
   - Makes state changes predictable
   - Easier to debug and understand
   - Prevents common bugs related to state management

3. **Virtual DOM**
   - Improves performance by minimizing DOM updates
   - Enables efficient re-rendering
   - Provides a declarative way to describe UI

4. **Hooks System**
   - Allows functional components to have state and side effects
   - Promotes code reuse through custom hooks
   - Makes complex state logic more manageable

## Project Initialization Files

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Defines project dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `vite.config.ts` | Vite build tool configuration |
| `eslint.config.js` | Code linting rules |

### Development Tools

- **Vite**: Fast build tool and development server
- **TypeScript**: Adds type safety to JavaScript
- **ESLint**: Enforces code quality and style
- **SCSS**: Enhanced CSS with variables and nesting

## Best Practices Summary

1. **Component Organization**
   - Keep components small and focused
   - Use clear, descriptive names
   - Follow consistent file structure

2. **State Management**
   - Use appropriate state management solutions
   - Keep state as local as possible
   - Use TypeScript for type safety

3. **Code Quality**
   - Follow consistent naming conventions
   - Write reusable, maintainable code
   - Use proper TypeScript types

4. **Performance**
   - Optimize re-renders with proper state management
   - Use appropriate lifecycle methods
   - Implement proper error handling
