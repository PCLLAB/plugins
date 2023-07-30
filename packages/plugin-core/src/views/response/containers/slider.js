require("../../misc/slider");
const ResponseContainer = require("./base");

// Util
const setParameter = require("../../../util").setParameter;

class SliderResponseContainer extends ResponseContainer {
  constructor(generatorInstance, stimulus, dataInstance) {
    super();

    this.generator = setParameter(generatorInstance, null, null);
    this.data = setParameter(dataInstance, null, null);
    this.stimulus = setParameter(stimulus, null, null);

    this.min = setParameter(this.stimulus.slider_min, 0, "number");
    this.max = setParameter(this.stimulus.slider_max, 100, "number");
    this.labelLeft = setParameter(
      this.stimulus.slider_label_left,
      "",
      "string",
    );
    this.labelRight = setParameter(
      this.stimulus.slider_label_right,
      "",
      "string",
    );

    this.$sliderContainer = $(`
			<div class="d-flex justify-content-center my-4">
				<span class="mr-2 mt-1">${this.labelLeft}</span>
					<form class="range-field w-75">
						<input class="border-0" type="range" min="${this.min}" max="${this.max}" />
					</form>
				<span class="ml-2 mt-1">${this.labelRight}</span>
			</div>
		`);
    this.$slider = this.$sliderContainer.find("input");
    this.$slider.rangeSlider();

    if (!this.data) {
      throw new Error("No data instance specified");
    }
  }

  get$() {
    return this.$sliderContainer;
  }

  remove() {
    this.$sliderContainer.remove();
  }
  focus() {}
  saveResponse() {}
}

module.exports = SliderResponseContainer;
