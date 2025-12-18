# Remix to React Router (Forked)

This is a fork of the original Remix to React Router codemod, with additional transformations to refactor code helpers like `json`, `redirect`, and `defer` to use the new React Router data API. Reducing the manual effort required to upgrade applications from Remix to React Router.

I wrote this for my work at [Carbon](https://github.com/crbnos/carbon) - if you get stuck while migrating or need a reference point for any files or config feel free to check it out :)

This codemod automates most of the manual steps outlined in the Remix to React Router upgrade guide.

https://github.com/remix-run/react-router/blob/dev/docs/upgrading/remix.md

- It updates your dependencies from the @remix-run/_ packages to react-router and @react-router/_ packages in package.json.
- It updates both static and dynamic imports from @remix-run/\* and react-router-dom to react-router.
- It handles moving removed imports from the host specific packages like @remix-run/architect, @remix-run/cloudflare etc and moving them to react-router.
- It updates any vi.mock module calls to the correct package name.
- It updates the scripts in your package.json if you are using the basic scripts from the Remix templates, otherwise it won't change the scripts.
- It updates the import and renames the plugin in your vite.config.ts.
- If you have an entry.server.tsx and/or an entry.client.tsx file in your application, it will update the main components and imports in these files, including renaming remixContext to reactRouterContext.
- It renames your server file's server build import from virtual:remix/server-build to virtual:react-router/server-build.
- It updates package names in compilerOptions.types in tsconfig.json files.
- It updates function parameters in loader and action functions to use the new React Router data API.
- It refactors usage of code helpers like json, redirect, defer to use the new React Router data API.
- It updates Remix specific names to React Router specific names.

## Migration Instructions

> https://github.com/remix-run/react-router/blob/dev/docs/upgrading/remix.md

### Usage

First build the codemod

```js
npm run build
```

Then run jscodeshift with the built codemod on your project directory

```bash
jscodeshift ./my-app -t ./dist/index.js --ignore-pattern='**/node_modules/**,build,dist'
```

## Remaining Manual Steps

You can directly jump to the step 4 of the Remix to React Router upgrade guide for the remaining manual steps after running this codemod.

Add the remaining files like `app/routes.ts` to your project.

Here is the sample code for `app/routes.ts`:

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
      // This is for server-side utilities you want to colocate
      // next to your routes without making an additional
      // directory. If you need a route that includes "server" or
      // "client" in the filename, use the escape brackets like:
      // my-route.[server].tsx
      "**/*.server.*",
      "**/*.client.*",
    ],
  });
}) satisfies RouteConfig;
```

## Credits

https://github.com/jrestall/react-router-codemods/tree/main/packages/remix-to-react-router
