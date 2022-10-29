import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";
import * as ReactDOM from "react-dom/client";
import { FreeRecall } from "./FreeRecall";
import * as React from "react";

const info = {
  name: "pcllab-free-recall",
  parameters: {
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
    //   /** Label of the button to submit responses. */
    //   button_label: {
    //     type: ParameterType.STRING,
    //     pretty_name: "Button label",
    //     default: "Continue",
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

// don't allow duplicates
// delete button or not

// TODO this isn't free recall dumbo
class FreeRecallPlugin implements JsPsychPlugin<Info> {
  static info = info;

  constructor(private jsPsych: JsPsych) {}

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    const root = ReactDOM.createRoot(display_element);

    const finishTrial = (trialData) => {
      root.unmount();
      this.jsPsych.finishTrial(trialData);
    };

    root.render(React.createElement(FreeRecall, { finishTrial, trial }));
  }
}

export default FreeRecallPlugin;
