import "jspsych/css/jspsych.css";
import "./style.css";

import fullscreen from "@jspsych/plugin-fullscreen";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import freeRecall from "@pcllab/plugin-free-recall";

import { initJsPsych } from "jspsych";

const jsPsych = initJsPsych();

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

jsPsych.run([recall]);
