import { JsPsych, TrialType } from "jspsych";
import React from "react";
import type { Info, TrialData } from ".";

interface Props {
  trial: TrialType<Info>;
  replayAudio: () => void;
  buttonHTMLStrings?: string[];
  finishTrial: () => void;
  jsPsych: JsPsych;
}

export const AudioResponse = ({
  trial,
  buttonHTMLStrings,
  replayAudio,
  finishTrial,
  jsPsych,
}: Props) => {
  const onContinue = () => {
    finishTrial();
  };
  return (
    <>
      {trial.prompt && (
        <div dangerouslySetInnerHTML={{ __html: trial.prompt }}></div>
      )}
      {trial.show_repeat_button && (
        <button onClick={replayAudio} className="jspsych-btn">
          Repeat
        </button>
      )}
      {trial.button && (
        <div id="jspsych-audio-button-response-btngroup">
          {buttonHTMLStrings!.map((buttonHTML, i) => (
            <div
              className="jspsych-audio-button-response-button"
              style={{
                cursor: "pointer",
                display: "inline-block",
                margin: `${trial.button.margin_vertical} ${trial.button.margin_horizontal}`,
              }}
              data-choice={trial.button.choices[i]}
              dangerouslySetInnerHTML={{ __html: buttonHTML }}
            ></div>
          ))}
        </div>
      )}
    </>
  );
};
