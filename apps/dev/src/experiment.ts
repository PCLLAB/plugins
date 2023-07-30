import "jspsych/css/jspsych.css";
import "./style.css";

import { initJsPsych } from "jspsych";
import pcllabAudioResponse from "@pcllab/plugin-audio-response";
import pcllabFreeRecall from "@pcllab/plugin-free-recall";
import pcllabCore from "@pcllab/plugin-core";

const jsPsych = initJsPsych({
  on_finish: () => {
    jsPsych.data.displayData();
  },
});

const studyTask = {
  type: pcllabCore,
  stimuli: [
    {
      //show the current iteration's cue and target
      text: `<div style="text-align: center; font-weight: 400; font-size: 24px">cue -- target</div>`,
    },
  ],
  response_count: 0,
  isi_time: 500,
  cue_count: 0,
  maximum_time: 1000 * 5,
};

// const start = {
//   type: pcllabFreeRecall,
// };

// const trial = {
//   type: pcllabAudioResponse,
//   prompt: "<div>this is the prompt</div>",
//   stimulus: "./audio.m4a",
//   button: {
//     choices: ["one", "two"],
//   },
//   keyboard: {},
//   response_allowed_while_playing: false,
//   show_repeat_button: true,
// };

jsPsych.run([studyTask]);
