# config

This _should_ just be an internal package that doesn't need to be built but....

I can't import `makeTsUpConfig.ts` directly into the `tsup.config.ts` files without issues.

Importing a `.ts` file will get an unrecognized file extension error.
It works if I use a `.mjs` file, but there will be a `cannot find module` warning everywhere.
Best I can figure is the [`bundle-require`](https://www.npmjs.com/package/bundle-require) package used by tsup to load the config file doesn't support ts dependencies somehow which makes sense?. You shouldn't be able to import ts across package boundaries? but also maybe you should be?.
