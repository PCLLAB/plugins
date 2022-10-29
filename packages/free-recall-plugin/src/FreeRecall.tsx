import { TrialType } from "jspsych";
import React, { FormEvent, useRef, useState } from "react";
import { Info } from "./plugin";

interface Props {
  trial: TrialType<Info>;
  finishTrial: (trialData: any) => void;
}

export const FreeRecall = ({ trial, finishTrial }: Props) => {
  const [words, setWords] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (inputRef.current == null) return;

    const word = inputRef.current.value;

    if (word === "" || words.includes(word)) {
      return;
    }

    setWords([...words, inputRef.current.value]);
    inputRef.current.value = "";
  };

  return (
    <>
      <ul>
        {words.map((word) => (
          <li key={word}>{word}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" ref={inputRef}></input>
      </form>
      <button onClick={finishTrial}>Continue</button>
    </>
  );
};
