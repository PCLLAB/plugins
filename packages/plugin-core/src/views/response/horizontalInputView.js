import $ from "jquery";
import InputView from "./inputView";

// Util
import { setParameter } from "../../util";

class HorizontalInputView extends InputView {
  render() {
    // Use stimulus response count over global response count, if mentioned
    const responseCount = setParameter(
      this.stimulus.response_count,
      this.coreInstance.response_count,
      "number"
    );

    const rowContainer = $("<div>", { class: "row justify-content-center" });
    for (let i = 0; i < responseCount; i++) {
      const responseContainer = this.newResponseContainer();
      const row = $("<div>", {
        class: "col-3",
      });

      // const col = $('<div>', {
      //     class: 'col text-center'
      // })
      rowContainer.append(row);
      // this.$displayElement.append(row)
      // row.append(col)
      row.append(responseContainer.get$());
    }
    rowContainer.appendTo(this.$displayElement);

    // Auto focus first input
    this.focusContainer(0);

    // Render honeypot input
    const hpResponseContainer = this.newHoneypotResponseContainer();
    this.$displayElement.append(hpResponseContainer.get$());
  }
}

export default HorizontalInputView;
