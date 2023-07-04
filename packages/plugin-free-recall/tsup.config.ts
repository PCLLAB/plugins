import { defineConfig } from "tsup";
import { globalExternals } from "@fal-works/esbuild-plugin-global-externals";

export default defineConfig((options) => {
  if (options.format?.includes("iife")) {
    return {
      globalName: "pcllabFreeRecall",
      tsconfig: "../tsconfig/iife.json",
      esbuildPlugins: [
        globalExternals({
          react: {
            varName: "React",
            namedExports: ["useState", "useMemo"],
          },
          "react-dom/client": "ReactDOM",
          jspsych: {
            varName: "jsPsychModule",
            namedExports: ["ParameterType"],
          },
        }),
      ],
      ...options,
    };
  }
  return options;
});
