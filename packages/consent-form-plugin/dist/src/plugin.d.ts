import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from 'jspsych';
declare const info: {
    name: string;
    parameters: {
        /** The url of the external html page */
        url: {
            type: ParameterType;
            pretty_name: string;
            default: string;
        };
    };
};
declare type Info = typeof info;
export default class ConsentFormPlugin implements JsPsychPlugin<Info> {
    private jsPsych;
    constructor(jsPsych: JsPsych);
    trial(display_element: HTMLElement, trial: TrialType<Info>, on_load?: (() => void) | undefined): Promise<void>;
}
export {};
