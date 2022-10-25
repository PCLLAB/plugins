import { TrialType } from "jspsych";
import * as React from "react";
import { Info } from "./plugin";

interface Props {
  trial: TrialType<Info>;
  finishTrial: () => void;
}

export const FreeRecall = ({ trial, finishTrial }: Props) => {
  return (
    <div>
      <input type="text"></input>
    </div>
  );
};
