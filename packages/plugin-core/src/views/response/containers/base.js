// Util
import { v4 as uuidv4 } from "uuid";

/* Response container interface */
class ResponseContainer {
  constructor() {
    this._id = uuidv4();
  }

  get$() {}
  focus() {}
  saveResponse() {}
  remove() {}
}

export default ResponseContainer;
