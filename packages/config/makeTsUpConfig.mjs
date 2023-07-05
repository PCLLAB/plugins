import { defineConfig } from "tsup";
import { globalExternals } from "@fal-works/esbuild-plugin-global-externals";

// type Params = {
//   globalName: string;
//   externals?: Parameters<typeof globalExternals>[0];
// };

// tsup.config.ts is only needed to define external globals for
// like React, ReactDOM, jsPsych for the iife format, to avoid bundling
// dependencies and including them multiple times

// default config (no tsup.config.ts necessary) is fine for esm, cjs

export function makeTsUpConfig({ globalName, externals = {} }) {
  // @ts-expect-error options differ
  return defineConfig((options) => {
    if (!options.format) {
      throw Error("no format defined");
    }
    if (
      options.format !== "iife" &&
      !(Array.isArray(options.format) && options.format.includes("iife"))
    ) {
      return options;
    }

    if (options.format.length > 1) {
      throw Error("iife format should be bundled separately");
    }

    return {
      globalName,
      // This tsconfig setting is necessary to properly bundle jsx using an external global React
      // "compilerOptions": {
      //   "jsx": "react"
      // }
      // using "jsx": "react-jsx" causes bundled code to import "react/jsx-runtime"
      tsconfig: "../tsconfig/iife.json",
      footer: {
        js: `${globalName} = ${globalName}.default;`,
      },
      esbuildPlugins: [
        // Feel free to add more base globalExternals
        globalExternals({
          react: {
            varName: "React",
            namedExports: ["createElement", "useState", "useMemo"],
          },
          "react-dom/client": {
            varName: "ReactDOM",
            namedExports: ["createRoot"],
          },
          jspsych: {
            varName: "jsPsychModule",
            namedExports: ["ParameterType"],
          },
          ...externals,
        }),
      ],
      ...options,
    };
  });
}
