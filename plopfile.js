module.exports = function (
  /** @type {import('plop').NodePlopAPI} */
  plop
) {
  // jspsych plugin generator
  plop.setGenerator("plugin", {
    description: "custom jspsych plugin",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "plugin name please",
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "packages/plugin-{{kebabCase name}}/",
        templateFiles: "plop-templates/plugin/**",
        base: "plop-templates/plugin/",
      },
    ],
  });
};
