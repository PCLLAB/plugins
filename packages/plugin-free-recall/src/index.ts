import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";
import * as ReactDOM from "react-dom/client";
import { FreeRecall } from "./FreeRecall";
import * as React from "react";

const info = {
  name: "pcllab-free-recall",
  parameters: {
    /** Allow users to remove added words */
    allow_delete: {
      type: ParameterType.BOOL,
      pretty_name: "Show delete",
      default: false,
    },
    /** Label of the button to submit responses. */
    button_label: {
      type: ParameterType.STRING,
      pretty_name: "Button label",
      default: "Continue",
    },
    /**
     * The HTML string to be displayed.
     */
    stimulus: {
      type: ParameterType.HTML_STRING,
      pretty_name: "Stimulus",
      default: null,
    },
  },
};

export type Info = typeof info;

export interface TrialData {
  response: string;
  rt_first_keypress: number;
  rt_last_keypress: number;
}

class FreeRecallPlugin implements JsPsychPlugin<Info> {
  static info = info;

  constructor(private jsPsych: JsPsych) {}

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    const root = ReactDOM.createRoot(display_element);

    /** Trial data is saved for every recalled word, instead of after one trial */
    const finishTrial = () => {
      root.unmount();
      this.jsPsych.finishTrial();
    };

    root.render(
      React.createElement(FreeRecall, {
        finishTrial,
        trial,
        jsPsych: this.jsPsych,
      })
    );
  }
}

export default FreeRecallPlugin;
