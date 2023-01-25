import { JsPsych, TrialType } from "jspsych";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import type { Info, TrialData } from "./plugin";

interface Props {
  trial: TrialType<Info>;
  finishTrial: () => void;
  jsPsych: JsPsych;
}

export const FreeRecall = ({ trial, finishTrial, jsPsych }: Props) => {
  const [words, setWords] = useState<string[]>([]);

  const [word, setWord] = useState("");

  const [prevLastKeypress, setPrevLastKeypress] = useState(performance.now());
  const [firstKeypress, setFirstKeypress] = useState<number | null>(null);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (firstKeypress == null) {
      setFirstKeypress(performance.now());
    }
    setWord(e.target.value.toLowerCase());
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (word === "" || words.includes(word) || firstKeypress == null) {
      return;
    }

    setWords([...words, word]);
    setWord("");

    const lastKeypress = performance.now();
    const data: TrialData = {
      response: word,
      rt_last_keypress: lastKeypress - prevLastKeypress,
      rt_first_keypress: firstKeypress - prevLastKeypress,
    };
    setPrevLastKeypress(lastKeypress);
    setFirstKeypress(null);

    jsPsych.data.write(data);
  };

  const removeWord = (word: string) => {
    setWords(words.filter((w) => w !== word));
  };

  const onContinue = () => {
    finishTrial();
  };

  return (
    <>
      <div className="vh-100 p-5">
        {trial.stimulus && (
          <div
            dangerouslySetInnerHTML={{ __html: trial.stimulus }}
            className="mb-3"
          ></div>
        )}
        <form onSubmit={handleSubmit} className="mb-3">
          <input
            value={word}
            onChange={onChange}
            type="text"
            autoComplete="false"
          ></input>
        </form>
        <div className="d-flex flex-column-reverse overflow-scroll h-75 border mb-3 rounded-1">
          <ul className="list-unstyled text-start flex-fill m-3">
            {words.map((word) => (
              <li
                key={word}
                className="d-flex justify-content-between align-items-center"
              >
                {word}
                {trial.allow_delete && (
                  <button
                    type="button"
                    className="btn-close ms-2"
                    aria-label={`Remove ${word}`}
                    onClick={() => removeWord(word)}
                  ></button>
                )}
              </li>
            ))}
          </ul>
        </div>
        <button onClick={onContinue} className="btn btn-primary">
          {trial.button_label}
        </button>
      </div>
    </>
  );
};
