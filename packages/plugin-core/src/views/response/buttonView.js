const InputView = require("./inputView");
const ButtonResponseContainer = require("./containers/button");
const ButtonHandler = require("../../handlers/buttonHandler");

// Util
const setParameter = require("../../util").setParameter;

class ButtonView extends InputView {
  newResponseContainer(buttonLabel) {
    const rc = new ButtonResponseContainer(
      this,
      buttonLabel,
      this.stimulus,
      this.dataInstance,
    );
    this.responseContainers.push(rc);
    ++this.numResponseContainers;

    return rc;
  }

  render() {
    const buttonLabels = setParameter(this.stimulus.buttons, [], null);

    const showRepeat = setParameter(
      this.stimulus.show_repeat,
      this.coreInstance.show_repeat,
      "boolean",
    );
    const response_columns = setParameter(
      this.stimulus.response_columns,
      this.coreInstance.response_columns,
      "number",
    );

    let indexOffset = Number(showRepeat);

    let $currentRow = $();
    let $firstRow = $();
    let index = indexOffset;

    buttonLabels.forEach((buttonLabel) => {
      if (index % response_columns === 0) {
        $currentRow = $("<div>", {
          class: "row justify-content-center mt-4",
        });
        this.$displayElement.append($currentRow);

        if (index < response_columns) {
          $firstRow = $currentRow;
        }
      }

      index++;

      const responseContainer = this.newResponseContainer(buttonLabel);

      const col = $("<div>", {
        class: "col-3 text-center",
      });

      $currentRow.append(col);
      col.append(responseContainer.get$());
    });

    // Move repeat button
    if (showRepeat) {
      const col = $("<div>", {
        class: "col-3 text-center",
      });
      $firstRow.prepend(col);
      setTimeout(() => col.append(this.coreInstance.$repeatButton), 5);
    }

    // Auto focus first input
    this.focusContainer(0);

    // Render honeypot input
    const hpResponseContainer = this.newHoneypotResponseContainer();
    this.$displayElement.append(hpResponseContainer.get$());
  }

  createHandler(nextButton) {
    return new ButtonHandler(nextButton, this.responseContainers);
  }
}

module.exports = ButtonView;
