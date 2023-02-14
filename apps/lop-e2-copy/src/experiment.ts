import "jspsych/css/jspsych.css";
import "./style.css";

import fullscreen from "@jspsych/plugin-fullscreen";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import imageButtonResponse from "@jspsych/plugin-image-button-response";
import instructionsPlugin from "@jspsych/plugin-instructions";
import freeRecall from "@pcllab/plugin-free-recall";

import instructions from "../Materials/instructions.json";
import Order1 from "../Materials/Order1.json";

import { initJsPsych } from "jspsych";

const jsPsych = initJsPsych();

const subNum = jsPsych.data.getURLVariable("workerId");
const order = jsPsych.data.getURLVariable("Version");
const condition = jsPsych.data.getURLVariable("condition");

const studyList1 = jsPsych.randomization.shuffleNoRepeats(Order1.slice(0, 8));
const testList1 = jsPsych.randomization.shuffleNoRepeats(studyList1);
const studyList2 = jsPsych.randomization.shuffleNoRepeats(Order1.slice(8, 16));
const testList2 = jsPsych.randomization.shuffleNoRepeats(studyList2);
const studyList3 = jsPsych.randomization.shuffleNoRepeats(Order1.slice(16, 24));
const testList3 = jsPsych.randomization.shuffleNoRepeats(studyList3);
const studyList4 = jsPsych.randomization.shuffleNoRepeats(Order1.slice(24, 32));
const testList4 = jsPsych.randomization.shuffleNoRepeats(studyList4);

const timeline = [];

const fullscreenTrial = {
  type: fullscreen,
  fullscreen_mode: true,
};

const recall = {
  type: freeRecall,
  allow_delete: true,
  button_label: "hi button label",
  stimulus: "<b>stim</b>",
};

const startInstr = {
  type: instructionsPlugin,
  pages: [
    instructions["welcome"].text,
    instructions["initial-study"].text,
    instructions["new-study"].text,
    instructions["old-study"].text,
  ],
  allow_keys: false,
  allow_backward: false,
  button_label_next: "Continue",
  show_clickable_nav: true,
};

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

studies.forEach((currentStudy, studyIndex) => {
  if (studyIndex !== 0) {
    timeline.push(newStudy);
  }

  const showListNum1 = {
    type: instructionsPlugin,
    pages: [currentStudy[0].ListNum],
    allow_keys: false,
    allow_backward: false,
    button_label_next: "Continue",
    show_clickable_nav: true,
    data: {
      ListNum: currentStudy[0].ListNum,
    },
    post_trial_gap: 500,
    on_finish: () => {
      const img = new Image();
      img.src = currentStudy[0].Picture_Source;
    },
  };
  timeline.push(showListNum1);

  for (let i = 0; i < 4; i++) {
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
        const img = new Image();
        img.src = currentStudy[i + 1].Picture_Source;
      },
    };
    timeline.push(studyBlockPicture);
  }
  return;

  const distractor1 = {};
  timeline.push(distractor1);

  const showListNum2 = {};
  timeline.push(showListNum2);

  for (let i = 0; i < 4; i++) {
    const studyBlockPicture = {};
    timeline.push(studyBlockPicture);
  }

  const distractor2 = {};
  timeline.push(distractor1);

  const currentTest = tests[studyIndex];

  const representInstruct = {};
  timeline.push(representInstruct);

  for (let k = 0; k < currentTest.length; k++) {
    if (condition === "CONDITION_1") {
      const listDisc = {};
      timeline.push(listDisc);
    }
    if (condition === "CONDITION_2") {
      const restudy = {};
      timeline.push(restudy);
    }
  }
});

jsPsych.run(timeline);
