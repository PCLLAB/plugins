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
    //   questions: {
    //     type: ParameterType.COMPLEX,
    //     array: true,
    //     pretty_name: "Questions",
    //     default: undefined,
    //     nested: {
    //       /** Question prompt. */
    //       prompt: {
    //         type: ParameterType.HTML_STRING,
    //         pretty_name: "Prompt",
    //         default: undefined,
    //       },
    //       /** Placeholder text in the response text box. */
    //       placeholder: {
    //         type: ParameterType.STRING,
    //         pretty_name: "Placeholder",
    //         default: "",
    //       },
    //       /** The number of rows for the response text box. */
    //       rows: {
    //         type: ParameterType.INT,
    //         pretty_name: "Rows",
    //         default: 1,
    //       },
    //       /** The number of columns for the response text box. */
    //       columns: {
    //         type: ParameterType.INT,
    //         pretty_name: "Columns",
    //         default: 40,
    //       },
    //       /** Whether or not a response to this question must be given in order to continue. */
    //       required: {
    //         type: ParameterType.BOOL,
    //         pretty_name: "Required",
    //         default: false,
    //       },
    //       /** Name of the question in the trial data. If no name is given, the questions are named Q0, Q1, etc. */
    //       name: {
    //         type: ParameterType.STRING,
    //         pretty_name: "Question Name",
    //         default: "",
    //       },
    //     },
    //   },
    //   /** If true, the order of the questions in the 'questions' array will be randomized. */
    //   randomize_question_order: {
    //     type: ParameterType.BOOL,
    //     pretty_name: "Randomize Question Order",
    //     default: false,
    //   },

    //   /** Setting this to true will enable browser auto-complete or auto-fill for the form. */
    //   autocomplete: {
    //     type: ParameterType.BOOL,
    //     pretty_name: "Allow autocomplete",
    //     default: false,
    //   },
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
