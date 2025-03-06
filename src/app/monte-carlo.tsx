"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { SimulationVisualiser } from "./simulation-visualiser";

export type Outcome = {
  sum: number,
  diceValues: number[]
}

export type Config = {
  numDie: number,
  numIterations: number,
  simulationDelay: number,
}

export function MonteCarlo() {

  const [config, setConfig] = useState<Config>();

  const timeout = useRef<NodeJS.Timeout>(null);
  const timeout2 = useRef<NodeJS.Timeout>(null);

  const outcomes = useRef<Outcome[]>([]);
  const [displayedOutcomes, setDisplayedOutcomes] = useState<Outcome[]>([]);

  function rollDice(): number {
    return Math.ceil(Math.random() * 6);
  }

  function runSimulation(numDice: number): void {
    const rolls: number[] = [];

    for (let i = 0; i < numDice; i++) {
      rolls.push(rollDice());
    }

    outcomes.current.push({
      sum: rolls.reduce((partialSum, a) => partialSum + a, 0),
      diceValues: rolls
    });
  }

  useEffect(() => {

    if (!config) {
      return;
    }

    clearInterval(timeout.current!);
    clearInterval(timeout2.current!);

    outcomes.current = [];  // Revert to default state

    timeout.current = setInterval(() => {
      setDisplayedOutcomes([...outcomes.current]);
    }, 100);

    timeout2.current = setInterval(() => {
      if (outcomes.current.length >= config.numIterations) {
        console.log("Max iterations.")
        clearInterval(timeout2.current!);
      }

      runSimulation(config.numDie);
    }, config.simulationDelay);

    return () => {
      clearInterval(timeout.current!);
      clearInterval(timeout2.current!);
    };
  }, [config]);

  /**
   * Handles form submission events.
   * Parses the form and updates config state.
   */
  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Parse input fields
    const formData = new FormData(e.currentTarget);
    const numDie = formData.get("input-num-die") as string;
    const numIterations = formData.get("input-num-iterations") as string;
    const simulationRate = formData.get("input-simulation-rate") as string;

    // Convert simulation rate -> delay
    const simulationDelay = 1000 / parseInt(simulationRate);

    // Update config state
    setConfig({
      numDie: parseInt(numDie),
      numIterations: parseInt(numIterations),
      simulationDelay
    });
  }

  return (
    <div className="flex flex-grow">

      {/* Config form */}
      <form onSubmit={handleFormSubmit}
        className="border border-dashed bg-white p-5 rounded max-w-[300px] flex flex-col gap-5">
        <label>
          <span>Number of die</span>
          <input
            type="number"
            name="input-num-die"
            placeholder="Enter a number"
            required
          />
        </label>

        <label title="How many times would you like to run the simulation?">
          <span>Number of iterations</span>
          <input
            type="number"
            name="input-num-iterations"
            placeholder="Enter a number"
            required
          />
        </label>

        <label title="How many times should the simulation run per second?">
          <span>Simulations / second</span>
          <input
            type="number"
            name="input-simulation-rate"
            placeholder="Enter a number"
            required
          />
        </label>

        <button type="submit" className="mt-auto">Run Simulation</button>
      </form>

      {/* Visualiser */}
      {
        config &&
        <SimulationVisualiser outcomes={displayedOutcomes} />
      }
    </div >
  );
}
