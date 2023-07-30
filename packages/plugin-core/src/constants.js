export const RESPONSE_ALIGNMENT = {
  left: "left",
  center: "center",
  right: "right",
};

export const CUE_ALIGNMENT = {
  horizontal: "horizontal",
  vertical: "vertical",
};

export const SCORING_STRATEGY = {
  dice: "dice",
  exact: "exact",
  ultron: "ultron",
};

export const INPUT_SIZE = {
  small: "small",
  medium: "medium",
  large: "large",
  xlarge: "xlarge",
};

export const RESPONSE_TYPE = {
  input: "input",
  horizontal_input: "horizontal_input",
  study_items: "study_items",
  free_recall: "free_recall",
  slider: "slider",
  checkbox: "checkbox",
  radio: "radio",
  button: "button",
};

let buttonColorClass = "btn-primary";

export const getButtonColorClass = () => {
  return buttonColorClass;
};

export const setButtonColorClass = (newButtonClass) => {
  buttonColorClass = newButtonClass;
};
