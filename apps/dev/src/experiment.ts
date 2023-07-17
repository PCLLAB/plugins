import "jspsych/css/jspsych.css";
import "./style.css";

import { initJsPsych } from "jspsych";
import audioResponse from "@pcllab/plugin-audio-response";
import freeRecall from "@pcllab/plugin-free-recall";

const jsPsych = initJsPsych({ on_finish: () => {
  jsPsych.data.get()
} });

const start = {
  type: freeRecall,
};

const trial = {
  type: audioResponse,
  prompt: "<div>this is the prompt</div>",
  stimulus: "./audio.m4a",
  button: {
    choices: ["one", "two"],
  },
  keyboard: {},
  response_allowed_while_playing: false,
  show_repeat_button: true,
};

jsPsych.run([start, trial]);
