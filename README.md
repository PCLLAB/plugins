# plugins

This repository contains custom `jsPsych` plugins developed by [@PCLLAB](http://learninglab.psych.purdue.edu)

## jsPsych Plugins

The jsPysch documentation provides a great overview of how plugins work.

https://www.jspsych.org/7.3/overview/plugins

## Parameters

Each plugin will have custom parameters which should be documented in their associated `README.md`. This should match the `info` property on the plugin class.

In addition, there are parameters available for all plugins which are specified by jsPsych.

https://www.jspsych.org/7.3/overview/plugins/#parameters-available-in-all-plugins

## Data Generated

Each plugin will collct custom data which should be documented in their associated `README.md`.

In addition, there is data that is collected by all plugins which is specified by jsPsych.

https://www.jspsych.org/7.3/overview/plugins/#data-collected-by-all-plugins

## Development

Everything below only applies to those contributing to this repository.

### Creating a new plugin release

We use https://github.com/changesets/changesets as well as the Github Action https://github.com/changesets/action to automatically create releases.

Whenever you have changes that you want to include in a new release, simply run `yarn changeset` and answer the questions.

The `.changeset` folder will contain all new changes.

Once the `main` branch on Github has been updated with the changesets, the action in `release.yml` will create a PR to update the version of all changed packages and include the changesets in the respective `CHANGELOG.md`.

Merging that PR will trigger an the `release.yml` workflow to release all packages with updated versions to npm.

This project was generated using [Nx](https://nx.dev).

### Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@plugins/mylib`.

### Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

### Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

### Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

### Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
