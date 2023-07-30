class PluginAPI {
  constructor(coreInstance) {
    this._coreInstance = coreInstance;
  }

  getAllData() {
    return this._coreInstance._data.getDataBlocks();
  }

  getLastData() {
    return this._coreInstance._data.getDataBlocks().slice(-1)[0];
  }

  getCompletedStimuli() {
    return this._coreInstance._completedStimuliList.slice();
  }

  getRemainingStimuli() {
    return this._coreInstance._stimuliList.slice().reverse();
  }

  setTimeline(newTimeline) {
    this._coreInstance._stimuliList = newTimeline.slice().reverse();
  }
}

module.exports = PluginAPI;
