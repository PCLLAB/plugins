import $ from "jquery";
import ResponseContainer from "./base";

// Util
import { setParameter, setTimeout } from "../../../util";

// Constants
import { getButtonColorClass } from "../../../constants";

class ButtonResponseContainer extends ResponseContainer {
  constructor(generatorInstance, buttonLabel, stimulus, dataInstance) {
    super();

    this.generator = setParameter(generatorInstance, null, null);
    this.data = setParameter(dataInstance, null, null);
    this.stimulus = setParameter(stimulus, null, null);
    this.buttonLabel = buttonLabel;

    if (!this.data) {
      throw new Error("No data instance specified");
    }

    this._selected = false;

    this.$button = $("<button>", {
      class: `btn btn-large ${getButtonColorClass()}`,
      text: this.buttonLabel,
    });
  }

  get$() {
    return this.$button;
  }

  remove() {
    this.$button.remove();
  }

  focus() {
    setTimeout(() => {
      this.$button.focus();
    }, 0);
  }

  select() {
    this._selected = true;
    this.data.registerKeyPress();
  }

  saveResponse() {
    if (this._selected) {
      this.data.recordResponse(this.buttonLabel);
    }
  }
}

export default ButtonResponseContainer;
