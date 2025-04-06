# TypeScript Module Resolution: `bundler` vs. `node`

This document explains the differences between the **`bundler`** and **`node`** options for TypeScript's `moduleResolution` setting, introduced in TypeScript 5.0.

---

## Overview

When TypeScript compiles your code, it needs to determine how to find and load imported modules. The **`moduleResolution`** setting in your `tsconfig.json` specifies which strategy TypeScript should use.

```jsonc
{
  "compilerOptions": {
    // ...
    "moduleResolution": "node" // or "bundler"
  }
}
```

There are two primary strategies:

- **`node`** (the default and most common approach for Node.js or bundler-based projects)
- **`bundler`** (a newer approach introduced in TS 5.0, aiming to match modern bundlers’ behavior more closely)

---

## `moduleResolution`: "node"

### Default Approach

Historically used by most TypeScript projects, especially any that run on or mimic Node.js.

### How It Works

- Follows **Node.js module resolution** rules:
    1. Checks for file extensions (`.ts`, `.tsx`, `.d.ts`, `.js`) relative to the import path.
    2. Searches **node_modules** folders up the directory tree.
    3. Respects `package.json` fields like **"main"**, **"module"**, **"exports"**, etc.
    4. Falls back to **index files** (e.g., `uiOptions.ts` or `index.js`) if the path points to a directory.

### Common Use Cases

- **Node.js** back-end applications.
- Front-end apps that rely on bundlers (e.g., Webpack, Vite) which simulate Node’s resolution under the hood.

### Pros

- Well-established, stable, and widely supported.
- The default for most existing TS configurations.
- Consistent if your environment is Node-like.

### Cons

- Doesn’t precisely match how all modern bundlers handle ESM edge cases.
- Some advanced ESM features might require extra config to align with Node’s fallback logic.

---

## `moduleResolution`: "bundler"

### Newer Strategy (TypeScript 5.0+)

Targets projects intended for modern bundlers (Rollup, Webpack 5, Vite, esbuild) that handle ESM differently from Node.

### How It Works

- Aligns TypeScript’s module resolution more closely with bundler behavior.
- May skip some Node-specific fallback rules (like searching for `uiOptions.ts`) if they aren’t typical in bundlers.
- Generally expects more strict ESM-based imports and exports.

### Common Use Cases

- **Pure front-end** applications reliant on a bundler’s ESM rules.
- Projects wanting minimal friction between how the bundler resolves modules and how TypeScript’s type-checking sees them.

### Pros

- Synchronizes TypeScript’s resolution with modern ESM bundlers.
- Reduces mismatches between TS checks and final bundle resolution.

### Cons

- If you rely on Node-like resolution features or file extensions (e.g., `.cjs`, `.mjs`), you might hit unexpected behavior.
- Ecosystem tooling is still adapting; some libraries may not behave as expected without additional config.

---

## Which Should You Choose?

- **Use `"node"`** if:
    1. You’re building for Node.js.
    2. You already have a stable workflow relying on Node-like module resolution.
    3. Your bundler is configured to mimic Node’s resolution (typical Webpack, Vite, Rollup setups).

- **Use `"bundler"`** if:
    1. Your project is purely front-end and does not rely on Node-specific resolution.
    2. You want strict alignment with new ESM bundler rules.
    3. You’re seeing mismatches or friction when using `"node"` and advanced ESM or `package.json` `"exports"` fields.

In most cases, `"node"` remains the standard option. Switch to `"bundler"` if you run into conflicts between TypeScript’s resolution and a modern bundler’s ESM approach.

---

## Example `tsconfig.json`

```jsonc
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler", // or "node"
    // ...
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

---

## Summary

- **`node`**: Follows Node.js conventions for loading modules (common in existing TS projects).
- **`bundler`**: A new TS 5.0+ strategy that matches modern ESM bundlers more closely.
- **Recommendation**: Stick with `"node"` unless you specifically need `"bundler"`’s alignment with advanced bundler-based ESM rules.

