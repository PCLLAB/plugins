import $ from "jquery";
import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";
import Core from "./core";
import { evaluateFunctionParameters } from "./util";

const info = {
  name: "pcllab-core",
  parameters: {
    /**
     * Stimuli array
     */
    stimuli: {
      type: ParameterType.COMPLEX,
      pretty_name: "Stimulus",
      default: [],
      array: true,
    },
  },
};

type Info = typeof info;

class CorePlugin implements JsPsychPlugin<Info> {
  static info = info;

  private jsPsych: JsPsych;

  constructor(private j: JsPsych) {
    this.jsPsych = j;
  }

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    trial = evaluateFunctionParameters(trial);

    $("body").bind("copy paste", function (e) {
      e.preventDefault();
      return false;
    });

    const core = new Core(display_element, trial, this.jsPsych);
    core.start();
  }
}

export default CorePlugin;
