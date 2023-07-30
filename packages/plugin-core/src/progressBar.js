/**
 * @name Progress Bar
 *
 * @param {number}	[duration]	Duration of the progress bar in ms
 * @param {boolean}	[reverse]	If true, renders the progress bar backwards
 *
 * @author Vishnu Vijayan
 */

import $ from "jquery";
import { setTimeout } from "./util";

export class ProgressBar {
  constructor(duration, reverse) {
    if (isNaN(duration)) {
      throw new Error("Progress bar duration is invalid");
    }

    this.duration = duration;
    this.reverse = Boolean(reverse);

    this.$progressBarContainer = $('<div class="progress"></div>');
    this.$progressBar = $('<div class="determinate" id="progressBar"></div>');
    this.$progressBar.css({ "animation-duration": this.duration + "ms" });

    if (this.reverse) {
      this.$progressBar.addClass("reverse");
    }

    this.$progressBarContainer.append(this.$progressBar);
  }

  get$Element() {
    return this.$progressBarContainer;
  }

  start() {
    this.$progressBarContainer.show();
    this.$progressBar.show();
    this.$progressBar.css({ "animation-play-state": "running" });
  }

  stop() {
    this.$progressBar.css({ "animation-play-state": "paused" });
  }

  done(callback) {
    if (typeof callback === "function") {
      this.$progressBar.on("animationend", callback);
    }
  }
}

export class TotalProgressBar {
  constructor(coreInstance) {
    this.coreInstance = coreInstance;
    this.duration = this._calculateDuration();
    this.$progressBarContainer = $('<div class="progress"></div>');
    this.$progressBar = $('<div class="determinate" id="progressBar"></div>');
    this.$progressBar.css({ "animation-duration": this.duration + "ms" });
    this.$progressBarContainer.append(this.$progressBar);
  }

  get$Element() {
    return this.$progressBarContainer;
  }

  start() {
    this.$progressBarContainer.show();
    this.$progressBar.show();
    this.$progressBar.css({ "animation-play-state": "running" });
  }

  stop() {
    this.$progressBar.css({ "animation-play-state": "paused" });
  }

  progressByTime(duration) {
    this.start();
    setTimeout(() => this.stop(), duration);
  }

  done(callback) {
    if (typeof callback === "function") {
      this.$progressBar.on("animationend", callback);
    }
  }

  _calculateDuration() {
    let n = this.coreInstance.stimuli.length;
    let isi_time = this.coreInstance.isi_time;
    let trial_time = this.coreInstance.show_button
      ? this.coreInstance.minimum_time
      : this.coreInstance.maximum_time;
    return (trial_time + isi_time) * n;
  }
}
