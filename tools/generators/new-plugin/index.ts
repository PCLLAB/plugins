import {
  Tree,
  formatFiles,
  installPackagesTask,
  generateFiles,
  joinPathFragments,
  readProjectConfiguration,
  updateProjectConfiguration,
} from "@nrwl/devkit";
import { libraryGenerator } from "@nrwl/js";

const kebabToPascal = (kebab: string) =>
  kebab
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

const pluginName = (name: string) => "pcllab-" + name;

export default async function (tree: Tree, schema: any) {
  await libraryGenerator(tree, {
    // These are required to be specified
    name: schema.name,
    buildable: true,
    config: "project",
    bundler: "rollup",
    // The implementation falls back to these values, but we shouldn't depend on that
    linter: "eslint",
    strict: true,
    testEnvironment: "jsdom",
    unitTestRunner: "jest",
    compiler: "tsc",
    // nwrl/js uses npm scope to automatically determine this.
    // importPath: `@pcllab/${schema.name}`,
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
  projectConfig.targets!.build.options.format = ["cjs", "esm"];

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
