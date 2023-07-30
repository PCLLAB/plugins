const ResponseContainer = require("./base");

// Util
const UUID4 = require("uuid4");
const setParameter = require("../../../util").setParameter;
const setTimeout = require("../../../util").setTimeout;

class RadioResponseContainer extends ResponseContainer {
  constructor(generatorInstance, stimulus, dataInstance) {
    super();

    this.generator = setParameter(generatorInstance, null, null);
    this.data = setParameter(dataInstance, null, null);
    this.stimulus = setParameter(stimulus, null, null);
    this.responseList = setParameter(stimulus.response_list, [], null);

    this._formWidth = -1;
    this._selected = null;

    if (!this.data) {
      throw new Error("No data instance specified");
    }

    this._makePanel();

    if (this.stimulus.radio_title) {
      this.generator.sharedResponsePanelBody.append(`
				<h5 class="text-center mt-2">${this.stimulus.radio_title}</h5>
			`);
    }

    this.form = $("<div>", { class: "mt-4", style: "margin: 0 auto;" });
    this.form.appendTo(this.generator.sharedResponsePanelBody);

    const isInline = setParameter(stimulus.horizontal, false, "boolean");
    let inlineClass = "";
    if (isInline) {
      inlineClass = "form-check-inline ml-2";
    } else {
      this.form.css("visibility", "hidden");
      this.form.css("text-align", "left");

      // Update the size of the container based on max label width
      setTimeout(() => {
        this.form.find(".form-check-label").each((_, label) => {
          const inputWidth = 13;
          this._formWidth = Math.max(
            $(label).outerWidth() + inputWidth * 3,
            this._formWidth,
          );
        });
        this.form.css({
          width: this._formWidth + "px",
          visibility: "visible",
        });
      }, 10);
    }

    const radioGroupName = UUID4();
    this.responseList.forEach((label) => {
      const _id = UUID4();
      const $radio = $(`
                <div class="form-check ${inlineClass}">
                    <input type="radio" class="form-check-input" id="${_id}" value="${label}" name="${radioGroupName}">
                    <label class="form-check-label" style="padding-left: 1.75rem; font-weight: 400" for="${_id}">${label}</label>
                <div>
			`);
      this.form.append($radio);

      // Listen for value changes
      $radio.find("input").change((event) => {
        this.data.registerKeyPress();
        this._selected = event.currentTarget.value;
      });
    });
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

  focus() {}

  saveResponse() {
    this.data.recordResponse(this._selected);
  }

  _makePanel() {
    if (this.generator.numResponseContainers === 0) {
      if (this.stimulus.response_panel_title) {
        this.generator.sharedResponsePanel = $(`
					<div class="row card rounded z-depth-1-indigo mb-3">
						<div class="card-header indigo">
							<h5 class="white-text text-uppercase text-left" style="font-weight: 500">${this.stimulus.response_panel_title}</h5>
						</div>
					</div>
				`);

        this.generator.sharedResponsePanelBody = $(`
					<div class="card-body p-3"></div>
				`);
        this.generator.sharedResponsePanelBody.appendTo(
          this.generator.sharedResponsePanel,
        );
      } else {
        this.generator.sharedResponsePanel = $("<div>", {
          class: "row",
        });
        this.generator.sharedResponsePanelBody = $("<div>", {
          class: "col",
        });
        this.generator.sharedResponsePanel.append(
          this.generator.sharedResponsePanelBody,
        );
      }
    }
  }
}

module.exports = RadioResponseContainer;
