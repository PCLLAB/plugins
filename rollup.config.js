const nrwlConfig = require("@nrwl/react/plugins/bundle-rollup");
const { terser } = require("rollup-plugin-terser");

/**
 *  We are highjacking the config from nrwl, because it doesn't support iife format (browser script)
 *  even though rollup can do it just fine
 *
 *  The cjs output is left out, because the @nrwl/web:rollup executor won't include it's path in the
 *  package.json, and I'm too lazy to override that executor for a non-existent usecase
 */
module.exports = (config) => {
  const nxConfig = nrwlConfig(config);
  const esmOutput = nxConfig.output;

  nxConfig.output = [
    esmOutput,
    {
      ...esmOutput,
      format: "iife",
      entryFileNames: "[name].browser.min.js",
      chunkFileNames: "[name].browser.min.js",
      plugins: [terser()],
    },
    // This will create the file, but it won't be findable b/c not mentioned in generated package.json
    // {
    //   ...esmOutput,
    //   format: "cjs",
    //   entryFileNames: "[name].cjs",
    //   chunkFileNames: "[name].cjs",
    // },
  ];
  return nxConfig;
};
