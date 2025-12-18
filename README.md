# Remix to React Router (Forked)

This is a fork of the original **Remix to React Router** codemod, with additional transformations to refactor helper utilities like `json`, `redirect`, and `defer` to use the new React Router data APIs. The goal is to reduce the amount of manual work required when upgrading applications from Remix to React Router.

I wrote this for my work at **[Carbon](https://github.com/crbnos/carbon)**. If you get stuck while migrating or need a reference point for configuration or edge cases, feel free to check it out.

This codemod automates most of the manual steps outlined in the official Remix to React Router upgrade guide:

[https://github.com/remix-run/react-router/blob/dev/docs/upgrading/remix.md](https://github.com/remix-run/react-router/blob/dev/docs/upgrading/remix.md)

---

## What the Codemod Does

* Updates dependencies in `package.json` from `@remix-run/*` packages to `react-router` and `@react-router/*` packages.
* Updates both static and dynamic imports from `@remix-run/*` and `react-router-dom` to `react-router`.
* Handles removed imports from host-specific packages such as `@remix-run/architect`, `@remix-run/cloudflare`, etc., and moves them to their new locations in React Router.
* Updates any `vi.mock()` module calls to use the correct package names.
* Updates scripts in `package.json` **only** if you are using the default Remix template scripts. Custom scripts are left unchanged.
* Updates the import and renames the plugin in `vite.config.ts`.
* If your app includes `entry.server.tsx` and/or `entry.client.tsx`, updates the main components and imports in those files, including renaming `remixContext` to `reactRouterContext`.
* Renames the server build import from `virtual:remix/server-build` to `virtual:react-router/server-build`.
* Updates package names in `compilerOptions.types` across `tsconfig.json` files.
* Updates function parameters in `loader` and `action` functions to match the new React Router data API.
* Refactors usage of helpers like `json`, `redirect`, and `defer` to use the new React Router data API.
* Renames Remix-specific identifiers to their React Router equivalents where applicable.

---

## Migration Instructions

Official guide:

[https://github.com/remix-run/react-router/blob/dev/docs/upgrading/remix.md](https://github.com/remix-run/react-router/blob/dev/docs/upgrading/remix.md)

---

## Usage

First, build the codemod:

```bash
npm run build
```

Then run `jscodeshift` with the built codemod against your project directory:

```bash
jscodeshift ./my-app -t ./dist/index.js --ignore-pattern='**/node_modules/**,build,dist'
```

---

## Remaining Manual Steps

After running the codemod, you can jump directly to **Step 4** of the Remix to React Router upgrade guide to complete the remaining manual steps.

You will need to add the remaining files required by React Router, such as `app/routes.ts`.

### Example `app/routes.ts`

```ts
import { type RouteConfig } from "@react-router/dev/routes";
import { remixRoutesOptionAdapter } from "@react-router/remix-routes-option-adapter";
import { flatRoutes } from "remix-flat-routes";

export default remixRoutesOptionAdapter((defineRoutes) => {
  return flatRoutes("routes", defineRoutes, {
    ignoredRouteFiles: [
      ".*",
      "**/*.css",
      "**/*.test.{js,jsx,ts,tsx}",
      "**/__*.*",
      // Server-side utilities colocated next to routes
      "**/*.server.*",
      "**/*.client.*",
    ],
  });
}) satisfies RouteConfig;
```

---

## Credits

Original codemod inspiration:

[https://github.com/jrestall/react-router-codemods/tree/main/packages/remix-to-react-router](https://github.com/jrestall/react-router-codemods/tree/main/packages/remix-to-react-router)
