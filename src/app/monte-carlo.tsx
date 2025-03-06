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

/**
 * Logic for running a Monte Carlo simulation.
 */
export function MonteCarlo() {

  const [config, setConfig] = useState<Config>();  // E.g. num dice, num iterations...
  const [running, setRunning] = useState<boolean>(false);  // Disables form while running

  // For clearing intervals / stopping simulation
  const timeout = useRef<NodeJS.Timeout>(null);
  const timeout2 = useRef<NodeJS.Timeout>(null);

  // Outcomes
  const outcomes = useRef<Outcome[]>([]);
  const [displayedOutcomes, setDisplayedOutcomes] = useState<Outcome[]>([]);

  /**
   * One roll of a uniformly distributed 6-sided die.
   * Returns 1 to 6.
   */
  function rollDice(): number {
    return Math.ceil(Math.random() * 6);
  }

  /**
   * A single trial in the monte carlo simulation.
   * Stores outcome of each trial.
   */
  function runTrial(numDice: number): void {
    const rolls: number[] = [];

    for (let i = 0; i < numDice; i++) {
      rolls.push(rollDice());
    }

    outcomes.current.push({
      sum: rolls.reduce((partialSum, a) => partialSum + a, 0),
      diceValues: rolls
    });
  }

  /**
   * Starts loops to run monte carlo simulation and render progress.
   */
  function startSimulation() {
    if (!config || running) {
      return;
    }

    setRunning(true);  // Disables form, while running
    outcomes.current = [];  // Ensure no data from previous simulations

    // Runs Monte Carlo simulation.
    timeout2.current = setInterval(() => {
      // Check if all iterations complete
      if (outcomes.current.length >= config.numIterations - 1) {
        console.log("Completed simulation!");
        stopSimulation();
      }
      // Otherwise, run trial
      runTrial(config.numDie);
    }, config.simulationDelay);

    // Refreshes display 10 times per second (1000ms in a second / 100ms delay)
    // This loop run indepedently of monte-carlo simulation loop above to avoid
    // performance issues due to excessive re-rendering of components.
    const REFRESH_DELAY = 100;
    timeout.current = setInterval(() => {
      setDisplayedOutcomes([...outcomes.current]);
    }, REFRESH_DELAY);

    console.log("Started simulation!");
  }

  /**
   * Clears all loops, stopping the simulation.
   */
  function stopSimulation() {
    clearInterval(timeout.current!);
    clearInterval(timeout2.current!);
    setRunning(false);
    console.log("Stopped simulation!");
  }

  /**
   * Runs whenever config is updated.
   * Stars simulation if config provided, and no simulation currently running.
   * Ensures simulation is stopped when component unmounted.
   */
  useEffect(() => {
    if (!config || running) {
      return;
    }

    startSimulation();

    return () => {
      stopSimulation();
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
      <form
        onSubmit={handleFormSubmit}
        className="border border-dashed bg-white p-5 rounded max-w-[300px] flex flex-col gap-5"
      >
        <label>
          <span>Number of die</span>
          <input
            type="number"
            name="input-num-die"
            defaultValue={2}
            placeholder="Enter a number"
            disabled={running}
            required
          />
        </label>

        <label title="How many times would you like to run the simulation?">
          <span>Number of iterations</span>
          <input
            type="number"
            name="input-num-iterations"
            defaultValue={1000}
            placeholder="Enter a number"
            disabled={running}
            required
          />
        </label>

        <label title="How many times should the simulation run per second?">
          <span>Simulations / second</span>
          <input
            type="number"
            name="input-simulation-rate"
            defaultValue={10}
            placeholder="Enter a number"
            disabled={running}
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
