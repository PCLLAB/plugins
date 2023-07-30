import $ from "jquery";
export const setParameter = (value, defaultValue, expectedType) => {
  if (typeof value === "function" && typeof value !== expectedType) {
    value = value();
  }

  if (expectedType && typeof value === expectedType) {
    return value;
  }

  if (typeof value !== "undefined") {
    return value;
  }

  return defaultValue;
};

export const setParameterFromConstants = (
  value,
  constants,
  defaultValue,
  expectedType
) => {
  if (typeof value === "function" && typeof value !== expectedType) {
    value = value();
  }

  if (typeof value === "undefined") {
    return defaultValue;
  }

  if (typeof value !== expectedType) {
    throw new Error(String(value) + "is not a valid parameter");
  }

  for (let key in constants) {
    constant = String(constants[key]);
    if (typeof constant === "number") {
      if (constant === Number(value)) {
        return constant;
      }
    } else {
      if (
        String(constant).localeCompare(String(value), "en", {
          sensitivity: "base",
        }) === 0
      ) {
        return constant;
      }
    }
  }

  throw new Error(String(value) + "is not a valid parameter");
};

export const $hide = (coreInstance, $el) => {
  $el.addClass("notransition");
  if (coreInstance.progress_total_time) {
    $el.css("visibility", "hidden");
  } else {
    $el.hide();
  }
};

export const $show = (coreInstance, $el) => {
  $el[0].offsetHeight;
  $el.removeClass("notransition");
  if (coreInstance.progress_total_time) {
    $el.css("visibility", "visible");
  } else {
    $el.show();
  }
};

export const $disableSelect = ($el) => {
  if (!$el) {
    return;
  }

  $el
    .css("-webkit-touch-callout", "none")
    .css("-webkit-user-select", "none")
    .css("-khtml-user-select", "none")
    .css("-moz-user-select", "none")
    .css("-ms-user-select", "none")
    .css("user-select", "none");
};

export const evaluateFunctionParameters = (trial) => {
  // save hooks
  const hookNames = [
    "on_stimulus_start",
    "on_stimulus_end",
    "done_callback",
    "feedback_html",
  ];
  const hooks = [];

  hookNames.forEach((hook) => hooks.push(trial[hook]));

  // flatten callbacks
  hookNames.forEach((hook) => {
    delete trial[hook];
  });

  // restore hooks
  hookNames.forEach((hook, index) => {
    trial[hook] = hooks[index];
  });

  return trial;
};

const intervals = [];
export const setInterval = (callback, time) => {
  const id = setInterval(callback, time);
  intervals.push(id);
};

const timeouts = [];
export const setTimeout = (callback, time) => {
  const id = window.setTimeout(callback, time);
  timeouts.push(id);
};

export const clearAllTimers = () => {
  intervals.forEach((id) => clearInterval(id));
  timeouts.forEach((id) => clearTimeout(id));
};

export const compareResponse = (response, target) => {
  if (typeof response === "string" && typeof target === "string") {
    return response.toLowerCase() === target.toLowerCase();
  }

  return response === target;
};
