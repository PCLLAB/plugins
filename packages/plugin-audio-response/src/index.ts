import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { AudioResponse } from "./AudioResponse";

const info = {
  name: "pcllab-audio-response",
  parameters: {
    /** The audio file to be played. */
    stimulus: {
      type: ParameterType.AUDIO,
      pretty_name: "Stimulus",
      default: undefined,
    },
    keyboard: {
      type: ParameterType.COMPLEX,
      pretty_name: "Keyboard",
      default: undefined,
      nested: {
        /** Array containing the key(s) the subject is allowed to press to respond to the stimulus. */
        choices: {
          type: ParameterType.KEYS,
          pretty_name: "Choices",
          default: "ALL_KEYS",
        },
      },
    },
    button: {
      type: ParameterType.COMPLEX,
      pretty_name: "Button",
      default: undefined,
      nested: {
        /** Array containing the label(s) for the button(s). */
        choices: {
          type: ParameterType.STRING,
          pretty_name: "Button choices",
          default: undefined,
          array: true,
        },
        /** The HTML for creating button. Can create own style. Use the "%choice%" string to indicate where the label from the choices parameter should be inserted. */
        html: {
          type: ParameterType.HTML_STRING,
          pretty_name: "Button HTML",
          default: '<button class="jspsych-btn">%choice%</button>',
          array: true,
        },
        /** Vertical margin of button. */
        margin_vertical: {
          type: ParameterType.STRING,
          pretty_name: "Margin vertical",
          default: "0px",
        },
        /** Horizontal margin of button. */
        margin_horizontal: {
          type: ParameterType.STRING,
          pretty_name: "Margin horizontal",
          default: "8px",
        },
      },
    },
    /** Any content here will be displayed below the stimulus. */
    prompt: {
      type: ParameterType.HTML_STRING,
      pretty_name: "Prompt",
      default: null,
    },
    /** The maximum duration to wait for a response. */
    trial_duration: {
      type: ParameterType.INT,
      pretty_name: "Trial duration",
      default: null,
    },
    /** If true, the trial will end when user makes a response. */
    response_ends_trial: {
      type: ParameterType.BOOL,
      pretty_name: "Response ends trial",
      default: true,
    },
    /** If true, then the trial will end as soon as the audio file finishes playing. */
    trial_ends_after_audio: {
      type: ParameterType.BOOL,
      pretty_name: "Trial ends after audio",
      default: false,
    },
    /** If true, then responses are allowed while the audio is playing. If false, then the audio must finish playing before a response is accepted. */
    response_allowed_while_playing: {
      type: ParameterType.BOOL,
      pretty_name: "Response allowed while playing",
      default: true,
    },
    show_repeat_button: {
      type: ParameterType.BOOL,
      pretty_name: "Show repeat button",
      default: false,
    },
  },
};

export type Info = typeof info;

export interface TrialData {}

class AudioResponsePlugin implements JsPsychPlugin<Info> {
  static info = info;

  constructor(private jsPsych: JsPsych) {}

  trial(display_element: HTMLElement, trial: TrialType<Info>) {
    // jsPsych doesn't apply defaults to nested objects
    if (trial.button) {
      Object.keys(info.parameters.button.nested).forEach((key) => {
        if (trial.button[key] == null) {
          // @ts-expect-error obviously key exists
          trial.button[key] = info.parameters.button.nested[key].default;
        }
      });

      if (Array.isArray(trial.button.html)) {
        if (trial.button.html.length !== trial.button.choices.length) {
          console.error(
            "pcllab-audio-response plugin: The length of the button.html array does not equal the length of the button.choices array"
          );
        }
      } else {
        trial.button.html = Array(trial.button.choices.length).fill(
          trial.button.html
        );
      }
    }
    // jsPsych doesn't apply defaults to nested objects
    if (trial.keyboard) {
      if (trial.keyboard.choices == null) {
        trial.keyboard.choices =
          info.parameters.keyboard.nested.choices.default;
      }
    }

    if (trial.show_repeat_button && trial.trial_ends_after_audio) {
      console.error(
        "pcllab-audio-response: cannot have show_repeat_button and trial_ends_after_audio both set to true."
      );
    }

    const context = this.jsPsych.pluginAPI.audioContext();

    if (context == null) {
      console.error(
        "pcllab-audio-response: Web Audio API is not supported by the browser"
      );
    }

    const root = ReactDOM.createRoot(display_element);

    const response: {
      rt: number | null;
      key?: string;
      button?: string;
    } = {
      rt: null,
      key: undefined,
      button: undefined,
    };

    let audioBuffer: AudioBuffer;
    let audio: AudioBufferSourceNode;
    let startTime: number;

    const finishTrial = () => {
      this.jsPsych.pluginAPI.clearAllTimeouts();

      audio.stop();

      audio.removeEventListener("ended", finishTrial);
      audio.removeEventListener("ended", setupKeyboardListener);
      audio.removeEventListener("ended", enableButtons);
      audio.removeEventListener("ended", getButtonHTMLStrings);

      root.unmount();

      this.jsPsych.finishTrial({
        rt: response.rt,
        stimulus: trial.stimulus,
        response: response.key || response.button,
      });
    };

    const replayAudio = () => {
      audio.stop();
      audio = context.createBufferSource();
      audio.buffer = audioBuffer;
      audio.connect(context.destination);
      audio.start();
    };

    const getButtonHTMLStrings = () => {
      if (trial.button == null) return;

      const buttons: string[] = trial.button.html;

      return buttons.map((button, i) =>
        button.replace(/%choice%/g, trial.button.choices[i])
      );
    };

    root.render(
      React.createElement(AudioResponse, {
        buttonHTMLStrings: getButtonHTMLStrings(),
        finishTrial,
        replayAudio,
        trial,
        jsPsych: this.jsPsych,
      })
    );

    // Main logic
    // This must run after the React elements are rendered
    this.jsPsych.pluginAPI.getAudioBuffer(trial.stimulus).then((buffer) => {
      audioBuffer = buffer as AudioBuffer;

      audio = context.createBufferSource();
      audio.buffer = audioBuffer;
      audio.connect(context.destination);

      startTime = context.currentTime;

      if (trial.trial_ends_after_audio) {
        audio.addEventListener("ended", finishTrial);
      }

      if (trial.response_allowed_while_playing) {
        setupKeyboardListener();
        enableButtons();
      } else {
        disableButtons();
      }

      if (
        !trial.response_allowed_while_playing &&
        !trial.trial_ends_after_audio
      ) {
        audio.addEventListener("ended", setupKeyboardListener);
        audio.addEventListener("ended", enableButtons);
      }

      if (trial.trial_duration != null) {
        this.jsPsych.pluginAPI.setTimeout(finishTrial, trial.trial_duration);
      }

      audio.start();
    });

    // Setup functions

    const setupKeyboardListener = () => {
      if (trial.keyboard == null) return;

      this.jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: (info: { key: string; rt: number }) => {
          if (response.key != null) return;

          response.key = info.key;
          response.rt = info.rt;

          if (trial.response_ends_trial) finishTrial();
        },
        valid_responses: trial.keyboard.choices,
        rt_method: "audio",
        persist: false,
        allow_held_key: false,
        audio_context: context,
        audio_context_start_time: startTime,
      });
    };

    function onButtonClick(e: any) {
      const choice = parseInt(e.currentTarget.getAttribute("data-choice"));

      const endTime = context.currentTime;
      const rt = Math.round((endTime - startTime) * 1000);

      response.button = trial.button.choices[choice];
      response.rt = rt;

      // disable all the buttons after a response
      disableButtons();

      if (trial.response_ends_trial) {
        finishTrial();
      }
    }

    function disableButtons() {
      const btns = document.querySelectorAll(
        ".jspsych-audio-button-response-button"
      );
      btns.forEach((btn) => {
        const btnEl = btn.querySelector("button");
        if (btnEl) {
          btnEl.disabled = true;
        }
        btn.removeEventListener("click", onButtonClick);
      });
    }

    function enableButtons() {
      const btns = document.querySelectorAll(
        ".jspsych-audio-button-response-button"
      );
      btns.forEach((btn) => {
        const btnEl = btn.querySelector("button");
        if (btnEl) {
          btnEl.disabled = false;
        }
        btn.addEventListener("click", onButtonClick);
      });
    }
  }
}

export default AudioResponsePlugin;
