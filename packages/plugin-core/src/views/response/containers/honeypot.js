const InputResponseContainer = require("./input");

class HoneypotResponseContainer extends InputResponseContainer {
  constructor(
    generatorInstance,
    containerSize,
    textAlignment,
    stimulus,
    dataInstance,
  ) {
    super(
      generatorInstance,
      containerSize,
      textAlignment,
      stimulus,
      dataInstance,
    );
    this.form.css("display", "none");
    this.label.remove();
  }
  get$() {
    const name_attrs = [
      "age_input",
      "name_input",
      "breakfast_input",
      "gender_input",
      "language_input",
      "email_input",
    ];
    this.textarea.attr(
      "name",
      name_attrs[Math.floor(Math.random() * name_attrs.length)],
    );
    this.textarea.attr("tabindex", 1);
    this.textarea.attr("autocomplete", "off");
    this.textarea.addClass("pcllab-hp-input");
    return this.form;
  }

  saveResponse() {
    if (this.textarea.val()) {
      this.data.recordHoneypotResponse(this.textarea.val());
    }
  }

  onKeyPress() {
    return () => {};
  }
}

module.exports = HoneypotResponseContainer;
