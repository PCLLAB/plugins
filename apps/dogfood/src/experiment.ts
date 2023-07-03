import "jspsych/css/jspsych.css";
import "./style.css";

import { initJsPsych } from "jspsych";
import audioResponse from "@pcllab/plugin-audio-response";

const jsPsych = initJsPsych({ on_finish: () => jsPsych.data.displayData() });

const start = {
  type: audioResponse,
  prompt: "<div>click to trigger</div>",
  stimulus: "./audio.m4a",
  button: {
    choices: ["next"],
  },
};

const trial = {
  type: audioResponse,
  prompt: "<div>this is the prompt</div>",
  stimulus: "./audio.m4a",
  button: {
    choices: ["one", "two"],
  },
  keyboard: {},
  show_repeat_button: true,
};

jsPsych.run([start, trial]);
