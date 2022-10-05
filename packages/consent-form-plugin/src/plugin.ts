import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from 'jspsych';

const info = {
  name: 'pcllab-consent-form',
  parameters: {
    /** The url of the external html page */
    url: {
      type: ParameterType.STRING,
      pretty_name: 'URL',
      default: 'https://jarvis.psych.purdue.edu/weblab/consent.html',
    },
  },
};
type Info = typeof info;

export default class ConsentFormPlugin implements JsPsychPlugin<Info> {
  static info = info;

  constructor(private jsPsych: JsPsych) {}

  async trial(
    display_element: HTMLElement,
    trial: TrialType<Info>,
    on_load?: (() => void) | undefined
  ) {
    const response = await fetch(trial.url);

    const checkboxHTML =
      '<br><h4>To continue, click the checkbox below and hit "Start Experiment".</h4> ' +
      '<div class="form-check pl-0"><input id="consent_checkbox" class="form-check-input" type="checkbox"><label for="consent_checkbox" style="font-size: larger;">I agree to take part in this study.</label></div><br>' +
      '<button id="continue_btn" class="btn btn-primary btn-lg pcllab-button-center waves-effect waves-light">Start Experiment</button>';

    display_element.innerHTML = (await response.text()) + checkboxHTML;

    const consentCheckbox = <HTMLInputElement>(
      display_element.querySelector('#consent_checkbox')
    );
    const continueBtn = <HTMLButtonElement>(
      display_element.querySelector('#continue_btn')
    );

    on_load && on_load();

    const t0 = performance.now();

    const finish = () => {
      if (!consentCheckbox.checked) {
        alert(
          'You need to read and accept the Consent Form to start the experiment. Check the agreement box.'
        );
        return;
      }

      const trialData = {
        rt: Math.round(performance.now() - t0),
        url: trial.url,
      };

      display_element.innerHTML = '';

      this.jsPsych.finishTrial(trialData);
    };

    continueBtn.addEventListener('click', finish);
  }
}
