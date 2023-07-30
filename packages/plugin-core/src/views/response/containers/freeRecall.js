const ResponseContainer = require("./base");

// Util
const setParameter = require("../../../util").setParameter;
const setTimeout = require("../../../util").setTimeout;

// Constants
const RESPONSE_ALIGNMENT = require("../../../constants").RESPONSE_ALIGNMENT;

class FreeRecallResponseContainer extends ResponseContainer {
  constructor(generatorInstance, stimulus, dataInstance) {
    super();

    this.generator = setParameter(generatorInstance, null, null);
    this.data = setParameter(dataInstance, null, null);
    this.stimulus = setParameter(stimulus, null, null);
    this.textAlignment = setParameter(
      this.generator.text_align | this.stimulus.text_align,
      RESPONSE_ALIGNMENT.center,
      "string",
    );

    let alignment = "text-center";
    switch (this.textAlignment) {
      case RESPONSE_ALIGNMENT.center:
        alignment = "text-center";
        break;
      case RESPONSE_ALIGNMENT.left:
        alignment = "text-left";
        break;
      case RESPONSE_ALIGNMENT.right:
        alignment = "text-right";
        break;
    }

    this.$listBody = $();
    this.$inputBody = $();

    this.responseList = [];

    this.$label = $("<label>", { text: "Type your response", for: this._id });
    this.$input = $("<input>", {
      class: `form-control pb-2 ${alignment}`,
      autocomplete: "off",
      type: "text",
      id: this._id,
    });
    this.$input.keypress(this._keyPress());

    if (!this.data) {
      throw new Error("No data instance specified");
    }

    this._makePanel();
  }

  get$() {
    if (this.generator.numResponseContainers == 1) {
      return this.generator.sharedResponsePanel;
    } else {
      return $();
    }
  }

  remove() {
    if (this.generator.numResponseContainers == 1) {
      this.generator.sharedResponsePanel.remove();
    }
  }

  focus() {
    setTimeout(() => {
      this.$input.focus();
    }, 0);
  }

  select() {
    this.data.registerKeyPress();
  }

  saveResponse() {
    const self = this;
    this.generator.sharedResponsePanelBody.find(".text-col").each(function () {
      self.data.recordResponse($(this).text());
    });
  }

  _makePanel() {
    if (this.generator.numResponseContainers === 0) {
      this.generator.sharedResponsePanel = $("<div>", {
        class: "row",
      });
      this.generator.sharedResponsePanelBody = $("<div>", {
        class: "col md-form md-outline",
      });

      this.generator.sharedResponsePanelBody.appendTo(
        this.generator.sharedResponsePanel,
      );

      // Response list
      const $listRow = $("<div>", {
        class: "row",
      });
      this.generator.sharedResponsePanelBody.append($listRow);

      this.$listBody = $("<div>", {
        class: "col rounded p-3",
        style: "border: 1px solid #BDBDBD; min-height: 270px",
      });
      $listRow.append(this.$listBody);

      // this.generator.sharedResponsePanelBody.append($('<hr>'))

      const $inputRow = $("<div>", {
        class: "row mt-4",
      });
      const $inputCol = $("<div>", {
        class: "col p-0",
      });
      $inputRow.append($inputCol);
      $inputCol.append(this.$input);
      // $inputCol.append(this.$label)
      this.generator.sharedResponsePanelBody.append($inputRow);
    }
  }

  _keyPress() {
    const self = this;
    return function (event) {
      const $input = $(this);
      const keycode = event.which;

      if (keycode === 13) {
        const text = $input.val().trim();
        $input.val("");
        if (text) {
          self._addListItem(text);
        }
      }

      self.select();
    };
  }

  _addListItem(text) {
    const $row = $("<div>", {
      class: "row pt-1 pb-1",
    });

    const $fillerCol = $("<div>", {
      class: "col text-center",
    });
    $fillerCol.appendTo($row);

    const $textCol = $("<div>", {
      class: "col-10 text-center text-col",
      text: text,
    });
    $textCol.appendTo($row);

    const $deleteCol = $("<div>", {
      class: "col text-center d-flex",
    });
    $deleteCol.appendTo($row);

    if (this.stimulus.show_delete) {
      const $deleteButton = $(`
				<button class="btn btn-white p-1 pl-2 pr-2 m-0 my-auto" style="border-radius: 99em; box-shadow: none;">
					<span style="color: #f44336; font-weight: bold">✕</span>
				</button>
			`);
      $deleteButton.appendTo($deleteCol);

      $deleteButton.click(() => {
        $row.remove();
        self.select();
      });
    }

    this.$listBody.append($row);
  }
}

module.exports = FreeRecallResponseContainer;
