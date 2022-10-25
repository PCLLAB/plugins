import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";
import * as ReactDOM from "react-dom/client";
import { FreeRecall } from "./FreeRecall";
import * as React from "react";

const info = {
  name: "survey-text",
  parameters: {
    questions: {
      type: ParameterType.COMPLEX,
      array: true,
      pretty_name: "Questions",
      default: undefined,
      nested: {
        /** Question prompt. */
        prompt: {
          type: ParameterType.HTML_STRING,
          pretty_name: "Prompt",
          default: undefined,
        },
        /** Placeholder text in the response text box. */
        placeholder: {
          type: ParameterType.STRING,
          pretty_name: "Placeholder",
          default: "",
        },
        /** The number of rows for the response text box. */
        rows: {
          type: ParameterType.INT,
          pretty_name: "Rows",
          default: 1,
        },
        /** The number of columns for the response text box. */
        columns: {
          type: ParameterType.INT,
          pretty_name: "Columns",
          default: 40,
        },
        /** Whether or not a response to this question must be given in order to continue. */
        required: {
          type: ParameterType.BOOL,
          pretty_name: "Required",
          default: false,
        },
        /** Name of the question in the trial data. If no name is given, the questions are named Q0, Q1, etc. */
        name: {
          type: ParameterType.STRING,
          pretty_name: "Question Name",
          default: "",
        },
      },
    },
    /** If true, the order of the questions in the 'questions' array will be randomized. */
    randomize_question_order: {
      type: ParameterType.BOOL,
      pretty_name: "Randomize Question Order",
      default: false,
    },
    /** Label of the button to submit responses. */
    button_label: {
      type: ParameterType.STRING,
      pretty_name: "Button label",
      default: "Continue",
    },
    /** Setting this to true will enable browser auto-complete or auto-fill for the form. */
    autocomplete: {
      type: ParameterType.BOOL,
      pretty_name: "Allow autocomplete",
      default: false,
    },
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

    const finishTrial = () => {
      root.unmount();
      this.jsPsych.finishTrial();
    };

    root.render(React.createElement(FreeRecall, { finishTrial, trial }));

    // let html = "";
    // // start form
    // if (trial.autocomplete) {
    //   html += '<form id="jspsych-survey-text-form">';
    // } else {
    //   html += '<form id="jspsych-survey-text-form" autocomplete="off">';
    // }
    // // generate question order
    // let question_order = Array.from(Array(trial.questions.length).keys());

    // if (trial.randomize_question_order) {
    //   question_order = this.jsPsych.randomization.shuffle(question_order);
    // }

    // question_order.forEach((qIndex) => {
    //   const question = trial.questions[qIndex];

    //   html += `<div id="jspsych-survey-text-${qIndex}" class="jspsych-survey-text-question" style="margin: 2em 0em;">`;

    //   const prompt = `<p class="jspsych-survey-text">${question.prompt}</p>`;
    //   html += prompt;

    //   const req = question.required ? "required" : "";

    //   if (question.rows == 1) {
    //     html += `<input type="text" id="input-${qIndex}" name="#jspsych-survey-text-response-${qIndex}" data-name="${question.name}" size="${question.columns}" autofocus ${req} placeholder=" ${question.placeholder}"></input>`;
    //   } else {
    //     html += `<textarea id="input-${qIndex}" name="#jspsych-survey-text-response-${qIndex}" data-name="${question.name}" cols="${question.columns}" rows="${question.rows}" autofucus ${req} placeholder="${question.placeholder}""></textarea>`;
    //   }
    //   html += "</div>";
    //   html += `<input type="submit" id="jspsych-survey-text-next" class="jspsych-btn jspsych-survey-text" value="${trial.button_label}'"></input>`;

    //   html += "</form>";
    //   display_element.innerHTML = html;
    //   const startTime = performance.now();

    //   display_element
    //     .querySelector("#jspsych-survey-text-form")
    //     .addEventListener("submit", (e) => {
    //       e.preventDefault();
    //       // measure response time
    //       const endTime = performance.now();
    //       const response_time = Math.round(endTime - startTime);

    //       // create object to hold responses
    //       const question_data = {};

    //       for (var index = 0; index < trial.questions.length; index++) {
    //         var id = "Q" + index;
    //         var q_element = document
    //           .querySelector("#jspsych-survey-text-" + index)
    //           .querySelector("textarea, input") as HTMLInputElement;
    //         var val = q_element.value;
    //         var name = q_element.attributes["data-name"].value;
    //         if (name == "") {
    //           name = id;
    //         }
    //         var obje = {};
    //         obje[name] = val;
    //         Object.assign(question_data, obje);
    //       }
    //       // save data
    //       var trialdata = {
    //         rt: response_time,
    //         response: question_data,
    //       };

    //       display_element.innerHTML = "";

    //       // next trial
    //       this.jsPsych.finishTrial(trialdata);
    //     });
    // });

    // // add submit button
  }
}

export default FreeRecallPlugin;
