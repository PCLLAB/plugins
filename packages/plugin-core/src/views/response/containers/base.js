// Util
const UUID4 = require("uuid4");

/* Response container interface */
class ResponseContainer {
  constructor() {
    this._id = UUID4();
  }

  get$() {}
  focus() {}
  saveResponse() {}
  remove() {}
}

module.exports = ResponseContainer;
