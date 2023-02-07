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

const instructions = {
  type: htmlButtonResponse,
};

jsPsych.run([fullscreenTrial, instructions]);
