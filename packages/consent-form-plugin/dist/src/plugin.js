"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jspsych_1 = require("jspsych");
const info = {
    name: 'pcllab-consent-form',
    parameters: {
        /** The url of the external html page */
        url: {
            type: jspsych_1.ParameterType.STRING,
            pretty_name: 'URL',
            default: 'consent.html',
        },
    },
};
class ConsentFormPlugin {
    constructor(jsPsych) {
        this.jsPsych = jsPsych;
    }
    trial(display_element, trial, on_load) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(trial.url);
            const checkboxHTML = '<br><h4>To continue, click the checkbox below and hit "Start Experiment".</h4> ' +
                '<div class="form-check pl-0"><input id="consent_checkbox" class="form-check-input" type="checkbox"><label for="consent_checkbox" style="font-size: larger;">I agree to take part in this study.</label></div><br>' +
                '<button id="continue_btn" class="btn btn-primary btn-lg pcllab-button-center waves-effect waves-light">Start Experiment</button>';
            display_element.innerHTML = (yield response.text()) + checkboxHTML;
            const consentCheckbox = (display_element.querySelector('#consent_checkbox'));
            const continueBtn = (display_element.querySelector('#continue_btn'));
            on_load && on_load();
            const t0 = performance.now();
            const finish = () => {
                if (!consentCheckbox.checked) {
                    alert('You need to read and accept the Consent Form to start the experiment. Check the agreement box.');
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
        });
    }
}
exports.default = ConsentFormPlugin;
//# sourceMappingURL=plugin.js.map