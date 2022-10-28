import {
  Tree,
  formatFiles,
  installPackagesTask,
  generateFiles,
  joinPathFragments,
  readProjectConfiguration,
  updateProjectConfiguration,
} from "@nrwl/devkit";
import { libraryGenerator } from "@nrwl/react";

import { Linter } from "@nrwl/linter";
const kebabToPascal = (kebab: string) =>
  kebab
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

const pluginName = (name: string) => "pcllab-" + name;

export default async function (tree: Tree, schema: any) {
  await libraryGenerator(tree, {
    name: schema.name,
    buildable: true,
    style: "css",
    skipTsConfig: false,
    skipFormat: false,
    unitTestRunner: "jest",
    /** @ts-ignore they use some stupid enum string type */
    linter: "eslint",
  });

  const projectConfig = readProjectConfiguration(tree, schema.name);
  const libraryRoot = projectConfig.root;

  // Remove unnecessary files from @nwrl:js template
  tree.delete(`${libraryRoot}/src/lib`);

  // Build target guaranteed to exist because buildable is set to true
  projectConfig.targets!.build.options.buildableProjectDepsInPackageJsonType =
    "dependencies";
  projectConfig.targets!.build.options.updateBuildableProjectDepsInPackageJson =
    true;
  projectConfig.targets!.build.options.project = `${libraryRoot}/package.json`;
  // bundled cjs for the browser without using type="module"
  // esm modules for the rest of us
  projectConfig.targets!.build.options.format = ["esm"];
  projectConfig.targets!.build.options.generateExportsField = true;
  projectConfig.targets!.build.options.buildableProjectDepsInPackageJsonType =
    "peerDependencies";
  projectConfig.targets!.build.options.rollupConfig = ["rollup.config.js"];

  updateProjectConfiguration(tree, schema.name, projectConfig);

  generateFiles(
    tree, // the virtual file system
    joinPathFragments(__dirname, "./files"), // path to the file templates
    libraryRoot, // destination path of the files
    {
      ...schema,
      tmpl: "", // replace __tmpl__ with ''
      kebabToPascal,
      pluginName,
    } // config object to replace variable in file templates
  );

  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}
