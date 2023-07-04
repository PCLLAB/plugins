// @ts-nocheck jsPsych.randomization.shuffleNoRepeats type is wrong
import "jspsych/css/jspsych.css";
import "./style.css";

// import fullscreen from "@jspsych/plugin-fullscreen";
// import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import imageButtonResponse from "@jspsych/plugin-image-button-response";
import instructionsPlugin from "@jspsych/plugin-instructions";
import surveyTextPlugin from "@jspsych/plugin-survey-text";
// import surveyPlugin from "@jspsych/plugin-survey";
// import freeRecallPlugin from "@pcllab/plugin-free-recall";

import instructions from "../Materials/instructions.json";
import Order1 from "../Materials/Order1.json";

import { initJsPsych } from "jspsych";

const jsPsych = initJsPsych({
  on_finish: () => {
    fetch("url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsPsych.data.get().json(),
    });
  },
});

// const subNum = jsPsych.data.getURLVariable("workerId");
// const order = jsPsych.data.getURLVariable("Version");
const condition = jsPsych.data.getURLVariable("condition");

const studyList1 = jsPsych.randomization.shuffleNoRepeats(Order1.slice(0, 8));
const testList1 = jsPsych.randomization.shuffleNoRepeats(studyList1);
const studyList2 = jsPsych.randomization.shuffleNoRepeats(Order1.slice(8, 16));
const testList2 = jsPsych.randomization.shuffleNoRepeats(studyList2);
const studyList3 = jsPsych.randomization.shuffleNoRepeats(Order1.slice(16, 24));
const testList3 = jsPsych.randomization.shuffleNoRepeats(studyList3);
const studyList4 = jsPsych.randomization.shuffleNoRepeats(Order1.slice(24, 32));
const testList4 = jsPsych.randomization.shuffleNoRepeats(studyList4);

const createLoopUntilTimeLimitTrial = (trial: any, time: number) => {
  let loop = true;

  const loopTrial = {
    timeline: [trial],
    loop_function: () => loop,
  };

  const timeLimitTrial = {
    timeline: [loopTrial],
    on_timeline_start: () => {
      setTimeout(() => {
        loop = false;
        jsPsych.finishTrial();
      }, time);
    },
  };
  return timeLimitTrial;
};

const timeline = [];

// const fullscreenTrial = {
//   type: fullscreen,
//   fullscreen_mode: true,
// };

// const startInstr = {
//   type: instructionsPlugin,
//   pages: [
//     instructions["welcome"].text,
//     instructions["initial-study"].text,
//     instructions["new-study"].text,
//     instructions["old-study"].text,
//   ],
//   allow_keys: false,
//   allow_backward: false,
//   button_label_next: "Continue",
//   show_clickable_nav: true,
// };

// TODO minimum time 7000
const newStudy = {
  type: instructionsPlugin,
  pages: [instructions["new-study"].text],
  allow_keys: false,
  allow_backward: false,
  button_label_next: "Continue",
  show_clickable_nav: true,
};

const studies = [studyList1, studyList2, studyList3, studyList4];
const tests = [testList1, testList2, testList3, testList4];

const distractor = {
  type: surveyTextPlugin,
  questions: () => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    const num3 = Math.floor(Math.random() * 9) + 1;

    return [{ prompt: `${num1} + ${num2} + ${num3}`, required: true }];
  },
};

studies.forEach((currentStudy, studyIndex) => {
  if (studyIndex !== 0) {
    timeline.push(newStudy);
  }

  for (let i = 0; i < 8; i++) {
    if (i == 0 || i == 4) {
      const showListNum = {
        type: instructionsPlugin,
        pages: [currentStudy[i].ListNum],
        allow_keys: false,
        allow_backward: false,
        button_label_next: "Continue",
        show_clickable_nav: true,
        data: {
          ListNum: currentStudy[i].ListNum,
        },
        post_trial_gap: 500,
        on_finish: () => {
          const img = new Image();
          img.src = currentStudy[i].Picture_Source;
        },
      };
      timeline.push(showListNum);
    }

    const studyBlockPicture = {
      type: imageButtonResponse,
      // Use duration instead of buttons
      choices: [],
      trial_duration: 2000,
      response_ends_trial: false,
      //
      stimulus: currentStudy[i].Picture_Source,
      stimulus_width: 500,
      post_trial_gap: 1000,
      on_finish: () => {
        if (i === 7) return;

        const img = new Image();
        img.src = currentStudy[i + 1].Picture_Source;
      },
    };
    timeline.push(studyBlockPicture);

    if (i === 3 || i === 7) {
      timeline.push(createLoopUntilTimeLimitTrial(distractor, 5000));
    }
  }

  const currentTest = tests[studyIndex];

  const representInstruct = {
    type: instructionsPlugin,
    pages: [
      "Next, the pictures that you just studied will be presented to you again.",
    ],
    allow_keys: false,
    allow_backward: false,
    button_label_next: "Continue",
    show_clickable_nav: true,
    post_trial_gap: 500,
    on_finish: () => {
      const img = new Image();
      img.src = currentStudy[0].Picture_Source;
    },
  };
  timeline.push(representInstruct);

  for (let k = 0; k < currentTest.length; k++) {
    if (condition === "CONDITION_1") {
      const listDisc = {
        type: imageButtonResponse,
        choices: ["List 1", "List 2"],
        //
        stimulus: currentTest[k].Picture_Source,
        stimulus_width: 500,
        post_trial_gap: 1000,
        on_finish: () => {
          if (k === currentTest.length - 1) return;

          const img = new Image();
          img.src = currentStudy[k + 1].Picture_Source;
        },
      };
      timeline.push(listDisc);
    }
    if (condition === "CONDITION_2") {
      const restudy = {
        type: imageButtonResponse,
        // Use duration instead of buttons
        choices: [],
        trial_duration: 2000,
        response_ends_trial: false,
        //
        stimulus: currentTest[k].Picture_Source,
        stimulus_width: 500,
        post_trial_gap: 1000,
        on_finish: () => {
          if (k === currentTest.length - 1) return;

          const img = new Image();
          img.src = currentTest[k + 1].Picture_Source;
        },
      };
      timeline.push(restudy);
    }
  }

  // const instructionsLookup1 = {
  //   type: instructionsPlugin,
  //   pages: [instructions["studylookup"].text],
  //   allow_keys: false,
  //   allow_backward: false,
  //   button_label_next: "Continue",
  //   show_clickable_nav: true,
  // };

  // const pacman = {};

  // const instructionsLookup2 = {
  //   type: instructionsPlugin,
  //   pages: [instructions["pacmanlookup"].text, instructions["test"].text],
  //   allow_keys: false,
  //   allow_backward: false,
  //   button_label_next: "Continue",
  //   show_clickable_nav: true,
  // };

  // const freeRecall = {
  //   type: freeRecallPlugin,
  //   allow_delete: false,
  //   button_label: "hi button label",
  //   stimulus: "<b>stim</b>",
  // };

  // const instructionsDemographics = {
  //   type: instructionsPlugin,
  //   pages: [instructions["demographics"].text],
  //   allow_keys: false,
  //   allow_backward: false,
  //   button_label_next: "Continue",
  //   show_clickable_nav: true,
  // };

  // const demographics = {
  //   type: surveyPlugin,
  //   title: "Demographics Information",
  //   pages: [
  //     [
  //       {
  //         type: "text",
  //         required: true,
  //         prompt: "What is your age?",
  //         name: "age",
  //         placeholder: "e.g. 25",
  //         input_type: "number",
  //       },
  //       {
  //         type: "text",
  //         required: true,
  //         prompt: "What is your gender?",
  //         name: "gender",
  //         placeholder: "e.g. female",
  //       },
  //       {
  //         type: "multi-choice",
  //         required: true,
  //         prompt: "Is English your first language?",
  //         name: "english",
  //         options: ["Yes", "No"],
  //         columns: 2,
  //       },
  //     ],
  //   ],
  // };

  // const debrief = {
  //   type: instructionsPlugin,
  //   pages: [instructions["end"].text, instructions["debrief"].text],
  //   allow_keys: false,
  //   allow_backward: false,
  //   button_label_next: "Continue",
  //   show_clickable_nav: true,
  // };
});

jsPsych.run(timeline);
