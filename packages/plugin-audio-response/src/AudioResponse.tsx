import { JsPsych, TrialType } from "jspsych";
import type { Info } from ".";

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
}: Props) => {
  return (
    <>
      {trial.prompt && (
        <div
          dangerouslySetInnerHTML={{ __html: trial.prompt }}
          className="mb-4"
        ></div>
      )}
      {trial.show_repeat_button && (
        <button onClick={replayAudio} className="jspsych-btn mb-4">
          Repeat
        </button>
      )}
      {trial.button && (
        <div id="jspsych-audio-button-response-btngroup">
          {buttonHTMLStrings!.map((buttonHTML, i) => (
            <div
              key={i}
              className="jspsych-audio-button-response-button"
              style={{
                cursor: "pointer",
                display: "inline-block",
                margin: `${trial.button.margin_vertical} ${trial.button.margin_horizontal}`,
              }}
              data-choice={i}
              dangerouslySetInnerHTML={{ __html: buttonHTML }}
            ></div>
          ))}
        </div>
      )}
    </>
  );
};
