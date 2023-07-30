import $ from "jquery";
import ResponseContainer from "./base";

// Util
import { setTimeout } from "../../../util";

// Constants
import { RESPONSE_ALIGNMENT, INPUT_SIZE } from "../../../constants";

class InputResponseContainer extends ResponseContainer {
  constructor(
    generatorInstance,
    containerSize,
    textAlignment,
    stimulus,
    dataInstance
  ) {
    super();

    this.generator = generatorInstance;
    this.data = dataInstance;
    this.stimulus = stimulus;
    this.mouseOver = false;

    if (!this.data) {
      throw new Error("No data instance specified");
    }

    this.form = $("<div>", {
      class: "md-form core-input-form md-outline w-75",
      style: "display: block; margin-left: auto; margin-right: auto;",
    });

    this.panel = $();

    let alignment = "text-center";
    switch (textAlignment) {
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

    switch (containerSize) {
      case INPUT_SIZE.small: {
        this.textarea = $("<input>", {
          class: `core-input-sm form-control pb-2 ${alignment}`,
          autocomplete: "off",
          type: "text",
          id: this._id,
        });
        break;
      }
      case INPUT_SIZE.medium: {
        this.textarea = $("<textarea>", {
          class: `md-textarea core-input-md form-control pb-2 ${alignment}`,
          autocomplete: "off",
          id: this._id,
        });
        break;
      }
      case INPUT_SIZE.large: {
        this.textarea = $("<textarea>", {
          class: `md-textarea core-input-lg form-control pb-2 ${alignment}`,
          autocomplete: "off",
          style: "height: 130px",
          id: this._id,
        });
        break;
      }
      case INPUT_SIZE.xlarge: {
        this.textarea = $("<textarea>", {
          class: `md-textarea core-input-xl form-control pb-2 ${alignment}`,
          autocomplete: "off",
          style: "min-height: 500px; height: 55vh",
          id: this._id,
        });
        // Make it extra thicc
        this.form.removeClass("w-75");
        this.form.addClass("w-100");
        break;
      }
      default: {
        this.textarea = $("<textarea>", {
          class: `pcllab-cued-recall-xlarge-input core-input form-control pb-2 ${alignment}`,
          autocomplete: "off",
          style: "height: 200px",
          id: this._id,
        });
      }
    }
    this.label = $("<label>", { text: "Type your response", for: this._id });

    if (this.stimulus.response_panel_title) {
      this._makePanel();
    }

    this.textarea.keypress(this.onKeyPress());
    this.textarea.mouseenter(this.onMouseEnter());
    this.textarea.mouseleave(this.onMouseLeave());
    this.textarea.bind("copy paste cut", (e) => e.preventDefault());

    this.form.append(this.textarea);
    // this.form.append(this.label)
  }

  get$() {
    if (this.stimulus.response_panel_title) {
      if (this.generator.numResponseContainers == 1) {
        return this.generator.sharedResponsePanel;
      } else {
        return $();
      }
    } else {
      return this.form;
    }
  }

  remove() {
    if (
      this.stimulus.response_panel_title &&
      this.generator.numResponseContainers == 1
    ) {
      this.generator.sharedResponsePanel.remove();
    } else {
      this.form.remove();
    }
  }

  focus() {
    setTimeout(() => {
      this.form.find("textarea, input").focus();
    }, 0);
  }

  saveResponse() {
    this.data.recordResponse(this.textarea.val());
  }

  onKeyPress() {
    const self = this;
    return ($event) => {
      self.data.registerKeyPress();
    };
  }

  onMouseEnter() {
    const self = this;
    return () => {
      self.mouseOver = true;
    };
  }

  onMouseLeave() {
    const self = this;
    return () => {
      self.mouseOver = false;
    };
  }

  onDragEnd() {
    const self = this;
    return (el) => {
      setTimeout(() => {
        if (self.mouseOver) {
          self.textarea.val($(el).text().trim());
          self.data.registerKeyPress();
        }
      }, 50);
    };
  }

  _makePanel() {
    this.form = $("<div>", {
      class: "md-form md-outline w-100",
      style: "display: block; margin-left: auto; margin-right: auto;",
    });

    if (this.generator.numResponseContainers == 0) {
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
        this.generator.sharedResponsePanel
      );
    }
    this.generator.sharedResponsePanelBody.append(this.form);
  }
}

export default InputResponseContainer;
