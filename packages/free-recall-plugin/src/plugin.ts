import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";

const info = {
  name: "pcllab-free-recall-plugin",
  parameters: {},
};

type Info = typeof info;

export default class FreeRecallPlugin implements JsPsychPlugin<Info> {
  static info = info;

  constructor(private jsPsych: JsPsych) {}

  async trial(
    display_element: HTMLElement,
    trial: TrialType<Info>,
    on_load?: (() => void) | undefined
  ) {}
}
