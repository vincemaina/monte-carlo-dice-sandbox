"use client";

import { useEffect, useRef, useState } from "react";
import { SimulationVisualiser } from "./simulation-visualiser";

interface Props {
  numDice: number;
  numIterations: number;
  simulationRate: number;
}

export type Outcome = {
  sum: number,
  diceValues: number[]
}

export function MonteCarlo(props: Props) {

  const timeout = useRef<NodeJS.Timeout>(null);
  const timeout2 = useRef<NodeJS.Timeout>(null);
  const outcomes = useRef<Outcome[]>([]);

  const [displayedOutcomes, setDisplayedOutcomes] = useState<Outcome[]>([]);

  function rollDice(): number {
    return Math.ceil(Math.random() * 6);
  }

  function runSimulation(): void {
    const rolls: number[] = [];

    for (let i = 0; i < props.numDice; i++) {
      rolls.push(rollDice());
    }

    outcomes.current.push({
      sum: rolls.reduce((partialSum, a) => partialSum + a, 0),
      diceValues: rolls
    });
  }

  useEffect(() => {
    clearInterval(timeout.current!);
    clearInterval(timeout2.current!);

    timeout.current = setInterval(() => {
      setDisplayedOutcomes([...outcomes.current]);
    }, 100);

    timeout2.current = setInterval(() => {
      if (outcomes.current.length >= props.numIterations) {
        console.log("Max iterations.")
        clearInterval(timeout2.current!);
      }
      runSimulation();
    }, props.simulationRate);

    return () => {
      clearInterval(timeout.current!);
      clearInterval(timeout2.current!);
    };
  }, [props.numIterations, props.numDice]);

  return (
    <>
      <SimulationVisualiser outcomes={displayedOutcomes} />
    </>
  );
}
