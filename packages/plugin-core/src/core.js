import $ from "jquery";
import { v4 as uuidv4 } from "uuid";
import Data from "./data";

// Components
import { ProgressBar, TotalProgressBar } from "./progressBar";
import ForcedResponseHandler from "./handlers/forcedResponseHandler";
import PluginAPI from "./pluginAPI";

// Buttons
import { NextButton, IDKButton, RepeatButton } from "./buttons";

// Constants
import {
  INPUT_SIZE,
  RESPONSE_TYPE,
  RESPONSE_ALIGNMENT,
  CUE_ALIGNMENT,
  SCORING_STRATEGY,
  getButtonColorClass,
  setButtonColorClass,
} from "./constants";

// Util
import {
  setParameter,
  setParameterFromConstants,
  $hide,
  $show,
  setTimeout,
  clearAllTimers,
  compareResponse,
} from "./util";

// Views
import RecallStandardView from "./views/recall/standardView";
import RecallHorizontalView from "./views/recall/horizontalView";
import RecallWordBankView from "./views/recall/wordBankView";
import ResponseInputView from "./views/response/inputView";
import ResponseHorizontalInputView from "./views/response/horizontalInputView";
import ResponseSliderView from "./views/response/sliderView";
import ResponseRadioView from "./views/response/radioView";
import ResponseButtonView from "./views/response/buttonView";
import ResponseFreeRecallView from "./views/response/freeRecallView";

/**
 * @name Core
 *
 * @param {string} 			[title]
 * @param {string}			[button_text]
 * @param {string}			[input_size]
 * @param {number} 			[response_count]
 * @param {number}			[isi_time]
 * @param {object}			stimuli
 * @param {object}			[stimulus_file]
 *
 * @author Vishnu Vijayan
 */

class Core {
  constructor(display_element, trial, jsPsych) {
    if (!display_element) {
      throw new Error("Invalid display element", display_element);
    }

    if (!trial) {
      throw new Error("Invalid trial", trial);
    }

    if (!trial.stimuli && !trial.stimulus_file) {
      throw new Error("Invalid trial stimulus", trial.stimuli);
    }

    this.jsPsych = jsPsych;

    // Plugin parameters
    this.trial = trial;
    this.stimuli = setParameter(trial.stimuli, [], null);
    this.randomize = setParameter(trial.randomize, false, "boolean");

    // Feedback parameters
    this.feedback = setParameter(trial.feedback, false, "boolean");
    this.feedback_html = setParameter(trial.feedback_html, null, "function");
    this.correct_feedback = setParameter(
      trial.correct_feedback,
      false,
      "boolean"
    );
    this.correct_feedback_time = setParameter(
      trial.correct_feedback_time,
      1500,
      "number"
    );

    // Stimulus parameters
    this.title = setParameter(trial.title, "", null);
    this.button_text = setParameter(trial.button_text, "Next", null);
    this.input_size = setParameter(
      trial.input_size,
      INPUT_SIZE.medium,
      "string"
    );
    this.show_button = setParameter(trial.show_button, false, "boolean");
    this.show_i_dont_know = setParameter(
      trial.show_i_dont_know,
      false,
      "boolean"
    );
    this.show_repeat = setParameter(trial.show_repeat, false, "boolean");
    this.show_delete = setParameter(trial.show_delete, true, "boolean");
    this.show_repeat_minimum_time = setParameter(
      trial.show_repeat_minimum_time,
      0,
      "number"
    );
    this.forced_response = setParameter(
      trial.forced_response,
      false,
      "boolean"
    );
    this.response_count = setParameter(trial.response_count, 1, "number");
    this.response_columns = setParameter(trial.response_columns, 1, "number");
    this.response_box_align = setParameter(
      trial.response_box_align,
      RESPONSE_ALIGNMENT.center,
      "string"
    ).toLowerCase();
    this.cue_alignment = setParameter(
      trial.cue_align,
      CUE_ALIGNMENT.vertical,
      "string"
    ).toLowerCase();
    this.word_bank_alignment = setParameter(
      trial.word_bank_alignm,
      CUE_ALIGNMENT.vertical,
      "string"
    ).toLowerCase();

    this.isi_hide_title = setParameter(trial.isi_hide_title, true, "boolean");
    this.isi_hide_button_container = setParameter(
      trial.isi_hide_button_container,
      true,
      "boolean"
    );
    this.isi_hide_trial_container = setParameter(
      trial.isi_hide_trial_container,
      true,
      "boolean"
    );
    this.isi_hide_progress_container = setParameter(
      trial.isi_hide_progress_container,
      true,
      "boolean"
    );

    // Timing parameters
    this.isi_time = setParameter(trial.isi_time || trial.isi, 500, "number");
    this.minimum_time = setParameter(trial.minimum_time, 0, "number");
    this.maximum_time = setParameter(trial.maximum_time, 3000, "number");
    this.show_progress = setParameter(trial.show_progress, false, "boolean");
    this.progress_total_time = setParameter(
      trial.progress_total_time,
      false,
      "boolean"
    );

    // Scoring parameters
    this.scoringStrategy = setParameterFromConstants(
      trial.scoring_strategy,
      SCORING_STRATEGY,
      null,
      "string"
    );
    this.scoringParams = setParameter(trial.scoring_params, null, null);

    // Hook functions
    this.on_stimulus_start = setParameter(
      trial.on_stimulus_start,
      () => {},
      "function"
    );
    this.on_stimulus_end = setParameter(
      trial.on_stimulus_end,
      () => {},
      "function"
    );
    this.done_callback = setParameter(
      trial.done_callback,
      () => {},
      "function"
    );

    // Template properties
    this.$display_element = $(display_element);
    this.$trial_container = null;
    this.$progress_container = null;
    this.$title = $();
    this.$button_container = null;
    this.$repeatButton = null;

    // Internal properties
    this._stimuliList = this.stimuli.slice().reverse();
    this._completedStimuliList = [];
    this._data = new Data(this);
    this._forcedResponseHandler = new ForcedResponseHandler();
    this._totalProgressBar = null;

    // Set default button color
    const oldButtonColor = getButtonColorClass();
    const newButtonColor = setParameter(
      trial.button_color_class,
      oldButtonColor,
      "string"
    );
    setButtonColorClass(newButtonColor);

    this.buildTemplate();
  }

  start() {
    if (this.trial.stimulus_file) {
      const self = this;
      $.getJSON(self.trial.stimulus_file, (data) => {
        self.stimuli = data;
        self._stimuliList = self.stimuli.slice().reverse();
        self._start();
      });
    } else {
      this._start();
    }
  }

  _start() {
    // Randomize stimuli if necessary
    if (this.randomize) {
      this._stimuliList = this.jsPsych.randomization
        .shuffle(this.stimuli)
        .reverse();
    }

    // Render the total progress bar
    if (this.progress_total_time && this.show_progress) {
      this._totalProgressBar = new TotalProgressBar(this);
      this.$progress_container.append(this._totalProgressBar.get$Element());
      this._totalProgressBar.start();
    }

    this.on_stimulus_start(this.pluginAPI);
    const stimulus = this._stimuliList.pop();
    this.showRecall(stimulus);
  }

  showRecall(stimulus) {
    clearAllTimers();

    stimulus._id = setParameter(stimulus._id, uuidv4(), "string");
    stimulus.data = setParameter(stimulus.data, {}, null);

    this.$trial_container.empty();
    this.$button_container.empty();
    this.$title.hide();

    if (!this.progress_total_time) {
      this.$progress_container.empty();
    }

    // Start data logging
    this._data.startRecall({
      cue: stimulus.cue,
      cue_list: stimulus.cue_list,
      target: stimulus.target,
      target_list: stimulus.target_list,
      type: stimulus.type,
      metadata: stimulus.data,
    });

    // Do not record cue data if feedback is showing
    if (stimulus._feedback) {
      this._data.currentDataBlock.cue = "Feedback";
      this._data.currentDataBlock.cue_list = undefined;
    }

    let responseViewType;
    let responseView;

    let cueResponseLayers = 1;
    let responseCount = setParameter(
      stimulus.response_count,
      this.response_count,
      "number"
    );
    //Display cues in layers
    if (stimulus.show_stacked_cue_response) {
      if (stimulus.response_count_list) {
        cueResponseLayers = stimulus.response_count_list.length;
      } else {
        cueResponseLayers = Math.ceil(stimulus.cue_list.length / responseCount);
      }

      const stimulusCueList = stimulus.cue_list.slice();

      let responseViews = [];
      /// response_count is the responses per LAYER
      for (let i = 0; i < cueResponseLayers; i++) {
        let layerResponseCount = stimulus.response_count_list
          ? stimulus.response_count_list[i]
          : responseCount;
        let layerCueList = stimulusCueList.slice(0, layerResponseCount);
        let layerStimulus = {
          ...stimulus,
          cue_list: layerCueList,
          response_count: layerCueList.length,
        };
        stimulusCueList.splice(0, layerResponseCount);

        let view = null;
        if (this.cue_alignment === CUE_ALIGNMENT.horizontal) {
          view = new RecallHorizontalView(layerStimulus);
        } else {
          view = new RecallStandardView(layerStimulus);
        }
        const cueResponseComboDiv = $("<div>");
        this.$trial_container.append(cueResponseComboDiv);

        let $responsePanel = cueResponseComboDiv;
        responseViewType = setParameter(
          stimulus.response_type,
          RESPONSE_TYPE.input,
          "string"
        );
        responseView = null;
        switch (responseViewType) {
          case RESPONSE_TYPE.slider: {
            responseView = new ResponseSliderView(
              $responsePanel,
              this,
              this._data,
              layerStimulus
            );
            break;
          }

          case RESPONSE_TYPE.radio: {
            responseView = new ResponseRadioView(
              $responsePanel,
              this,
              this._data,
              layerStimulus
            );
            break;
          }

          case RESPONSE_TYPE.study_items: {
            responseView = new ResponseInputView(
              $responsePanel,
              this,
              this._data,
              layerStimulus
            );
            break;
          }

          case RESPONSE_TYPE.button: {
            responseView = new ResponseButtonView(
              $responsePanel,
              this,
              this._data,
              layerStimulus
            );
            break;
          }

          case RESPONSE_TYPE.free_recall: {
            responseView = new ResponseFreeRecallView(
              $responsePanel,
              this,
              this._data,
              layerStimulus
            );
            break;
          }

          case RESPONSE_TYPE.horizontal_input: {
            responseView = new ResponseHorizontalInputView(
              $responsePanel,
              this,
              this._data,
              layerStimulus
            );
            break;
          }

          default: {
            responseView = new ResponseInputView(
              $responsePanel,
              this,
              this._data,
              layerStimulus
            );
          }
        }
        view.appendTo(cueResponseComboDiv);
        responseViews.push(responseView);
      }

      // Render in backwards order to first input is focused instead of last
      for (let rv = responseViews.length - 1; rv >= 0; rv--) {
        responseViews[rv].render();

        if (rv == responseViews.length - 1) {
          responseView = responseViews[rv];
        } else {
          responseView.responseContainers = responseViews[
            rv
          ].responseContainers.concat(responseView.responseContainers);
          console.log(responseView);
        }
      }
    } else {
      let view = null;
      if (this.cue_alignment === CUE_ALIGNMENT.horizontal) {
        view = new RecallHorizontalView(stimulus);
      } else {
        view = new RecallStandardView(stimulus);
      }
      view.appendTo(this.$trial_container);

      // Where response inputs go
      let $responsePanel = this.$trial_container;
      // Where the word bank goes
      let $wordBankPanel = this.$trial_container;

      if (
        stimulus.word_list &&
        this.word_bank_alignment === CUE_ALIGNMENT.vertical
      ) {
        const $row = $("<div>", { class: "row mt-2 mb-2" });
        $responsePanel = $("<div>", { class: "col-8" });
        $wordBankPanel = $("<div>", { class: "col-4" });

        $row.append($responsePanel);
        $row.append($wordBankPanel);

        this.$trial_container.append($row);
      }

      // Set title
      if (stimulus.title) {
        this.$title.find("h1").text(stimulus.title);
        this.$title.show();
      } else if (this.title) {
        this.$title.find("h1").text(this.title);
        this.$title.show();
      }

      // Render response containers
      responseViewType = setParameter(
        stimulus.response_type,
        RESPONSE_TYPE.input,
        "string"
      );
      responseView = null;
      switch (responseViewType) {
        case RESPONSE_TYPE.slider: {
          responseView = new ResponseSliderView(
            $responsePanel,
            this,
            this._data,
            stimulus
          );
          break;
        }

        case RESPONSE_TYPE.radio: {
          responseView = new ResponseRadioView(
            $responsePanel,
            this,
            this._data,
            stimulus
          );
          break;
        }

        case RESPONSE_TYPE.study_items: {
          responseView = new ResponseInputView(
            $responsePanel,
            this,
            this._data,
            stimulus
          );
          break;
        }

        case RESPONSE_TYPE.button: {
          responseView = new ResponseButtonView(
            $responsePanel,
            this,
            this._data,
            stimulus
          );
          break;
        }

        case RESPONSE_TYPE.free_recall: {
          responseView = new ResponseFreeRecallView(
            $responsePanel,
            this,
            this._data,
            stimulus
          );
          break;
        }

        case RESPONSE_TYPE.horizontal_input: {
          responseView = new ResponseHorizontalInputView(
            $responsePanel,
            this,
            this._data,
            stimulus
          );
          break;
        }

        default: {
          responseView = new ResponseInputView(
            $responsePanel,
            this,
            this._data,
            stimulus
          );
        }
      }
      responseView.render();
    }

    // Render word bank
    if (stimulus.word_list) {
      const wordBank = new RecallWordBankView(
        stimulus,
        this.word_bank_alignment
      );
      wordBank.appendTo($wordBankPanel);
      wordBank.attachInputs(responseView.responseContainers);
    }

    // Render next button
    const buttonText = setParameter(
      stimulus.button_text,
      this.button_text,
      "string"
    );
    const forcedResponse =
      responseViewType === RESPONSE_TYPE.button
        ? true
        : setParameter(
            stimulus.forced_response,
            this.forced_response,
            "boolean"
          );
    const nextButton = new NextButton(buttonText);
    nextButton.click(() => {
      nextButton.prop("disabled", true);
      this._endRecall(stimulus, responseView.responseContainers);
    });

    if (forcedResponse) {
      this._forcedResponseHandler.register(nextButton, responseView);
    }

    // Repeat button
    const showRepeat = setParameter(
      stimulus.show_repeat,
      this.show_repeat,
      "boolean"
    );
    const showRepeatMinimumTime = setParameter(
      stimulus.show_repeat_minimum_time,
      this.show_repeat_minimum_time,
      "number"
    );
    if (showRepeat && stimulus.audio_file) {
      this.$repeatButton = new RepeatButton(this._data);
      this.$button_container.append(this.$repeatButton);
      this.$repeatButton.hide();

      setTimeout(() => this.$repeatButton.show(), showRepeatMinimumTime);
    }

    // Show I don't know button
    const showIDK = setParameter(
      stimulus.show_i_dont_know,
      this.show_i_dont_know,
      "boolean"
    );
    if (showIDK) {
      const idkButton = new IDKButton(this._data);
      this.$button_container.append(idkButton);
    }

    // Wait before showing button
    const minimumTime = setParameter(
      stimulus.minimum_time,
      this.minimum_time,
      "number"
    );
    const maximumTime = setParameter(
      stimulus.maximum_time,
      this.maximum_time,
      "number"
    );
    const showButton = setParameter(
      stimulus.show_button,
      this.show_button,
      "boolean"
    );
    if (showButton || responseViewType === RESPONSE_TYPE.button) {
      const self = this;
      if (this.trial.maximum_time) {
        setTimeout(
          () => this._endRecall(stimulus, responseView.responseContainers),
          maximumTime
        );
      }

      if (this.show_progress && !this.progress_total_time) {
        const progressBar = new ProgressBar(minimumTime);
        this.$progress_container.append(progressBar.get$Element());
        progressBar.done(() => {
          this.$button_container.append(nextButton);
          this.$progress_container.empty();
        });
        progressBar.start();
      } else {
        // Progress the total progress bar for self-paced experiments
        if (this.progress_total_time) {
          this._totalProgressBar.progressByTime(minimumTime);
        }
        setTimeout(() => {
          self.$button_container.append(nextButton);
        }, minimumTime);
      }
    } else {
      // Automatically advance the trial
      if (this.show_progress && !this.progress_total_time) {
        const progressBar = new ProgressBar(maximumTime);
        this.$progress_container.append(progressBar.get$Element());
        progressBar.done(() =>
          this._endRecall(stimulus, responseView.responseContainers)
        );
        progressBar.start();
      } else {
        setTimeout(
          () => this._endRecall(stimulus, responseView.responseContainers),
          maximumTime
        );
      }
    }
  }

  _endRecall(stimulus, responseContainers) {
    // End data logging
    responseContainers.forEach((responseContainer) =>
      responseContainer.saveResponse()
    );
    // responseContainers.forEach(responseContainer => responseContainer.remove())
    this._data.endRecall();
    this._completedStimuliList.push(stimulus);
    this.on_stimulus_end(this.pluginAPI, stimulus);

    // Correct feedback
    let correctFeedback = setParameter(
      stimulus.correct_feedback,
      this.correct_feedback,
      "boolean"
    );
    const datablock = this._data.getDataBlocks().pop();
    const showCorrectFeedback =
      correctFeedback && compareResponse(datablock.response, datablock.target);
    if (showCorrectFeedback) {
      this.renderCorrectFeedback();
    }

    // Answer feedback
    let showFeedback = setParameter(
      stimulus.feedback,
      this.feedback,
      "boolean"
    );
    if (showFeedback) {
      const feedbackStimulus = this.buildFeedback(stimulus, datablock);
      this._stimuliList.push(feedbackStimulus);
    }

    const correctFeedbackTime = showCorrectFeedback
      ? setParameter(
          stimulus.correct_feedback_time,
          this.correct_feedback_time,
          "number"
        )
      : 0;
    setTimeout(() => {
      // No more stimuli left, so end the trial
      if (this._stimuliList.length === 0) {
        this.end();
        return;
      }

      this.isiWait(() => {
        this.on_stimulus_start(this.pluginAPI);
        this.showRecall(this._stimuliList.pop());
      });
    }, correctFeedbackTime);
  }

  end() {
    this.$display_element.empty();
    this.done_callback(this._data.getDataBlocks());
    this._data.finishTrial();
  }

  get pluginAPI() {
    return new PluginAPI(this);
  }

  buildTemplate() {
    this.$title = $(`
			<div class="row justify-content-center">
				<h1>${this.title}</h1>
			</div>
		`);
    this.$display_element.append(this.$title);

    this.$display_element.append(`
			<div class="row mt-4 mb-4">
				<div class="col" id="trial_container"></div>
			</div>
		`);
    this.$trial_container = $("#trial_container");

    this.$display_element.append(`
			<div class="row">
				<div class="col text-center" id="button_container"></div>
			</div>
		`);
    this.$button_container = $("#button_container");

    this.$display_element.append(`
				<div class="row mt-2">
					<div class="col text-center" id="progress_container"></div>
				</div>
			`);
    this.$progress_container = $("#progress_container");

    if (!this.show_progress) {
      this.$progress_container.empty();
    }
  }

  buildFeedback(stimulus, dataBlock) {
    let cueList = [];
    if (dataBlock.cue) {
      cueList.push("Question: " + dataBlock.cue);
    }

    if (dataBlock.target) {
      cueList.push("Correct answer: " + dataBlock.target);
    }

    cueList.push("Your answer: " + dataBlock.response);

    let feedbackStimulus = {
      cue_list: cueList,
      show_i_dont_know: false,
      feedback: false,
      _feedback: true, // internal feedback stimulus
      response_count: 0,
    };

    const feedbackHtml = setParameter(
      stimulus.feedback_html,
      this.feedback_html,
      null
    );
    if (feedbackHtml) {
      delete feedbackStimulus.cue_list;
      feedbackStimulus.text = feedbackHtml(this._data.getDataBlocks());
    }

    return feedbackStimulus;
  }

  renderCorrectFeedback() {
    const $feedback = $(`
			<div class="row justify-content-center">
				<h2 class="text-success">Correct</h2>
			</div>
		`);
    this.$trial_container.append($feedback);
  }

  isiWait(callback) {
    $hide(this, $("input, textarea"));
    this.isi_hide_title && $hide(this, this.$title);
    this.isi_hide_button_container && $hide(this, this.$button_container);
    this.isi_hide_trial_container && $hide(this, this.$trial_container);

    if (!this.progress_total_time) {
      this.isi_hide_progress_container && this.$progress_container.hide();
    } else if (this.show_progress && this.show_button) {
      // When experiment is self-paced, advance the progress bar through isi
      this._totalProgressBar.progressByTime(this.isi_time);
    }

    const self = this;
    setTimeout(() => {
      $show(self, self.$title);
      $show(self, self.$button_container);
      $show(self, self.$trial_container);
      $show(self, self.$progress_container);
      callback();
    }, this.isi_time);
  }
}

export default Core;
