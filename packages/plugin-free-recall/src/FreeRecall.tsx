import { JsPsych, TrialType } from "jspsych";
import { ChangeEvent, FormEvent, useState } from "react";

import type { Info, TrialData } from ".";

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
      <div className="p-5 flex flex-col gap-3">
        {trial.stimulus && (
          <div dangerouslySetInnerHTML={{ __html: trial.stimulus }}></div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            value={word}
            onChange={onChange}
            type="text"
            autoComplete="false"
          ></input>
        </form>
        <div className="flex flex-col-reverse overflow-scroll h-96 border rounded-sm">
          <ul className="grow">
            {words.map((word) => (
              <li
                key={word}
                className="flex justify-between items-center px-3 py-1"
              >
                {word}
                {trial.allow_delete && (
                  <button
                    type="button"
                    className="opacity-50 hover:opacity-100"
                    onClick={() => removeWord(word)}
                  >
                    <span className="sr-only">{`Remove ${word}`}</span>
                    <svg
                      className="h-6 w-6 p-1"
                      fill="none"
                      viewBox="0 0 16 16"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M0 16L16 0M0 0L16 16"
                      />
                    </svg>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
        <button onClick={onContinue} className="jspsych-btn">
          {trial.button_label}
        </button>
      </div>
    </>
  );
};
