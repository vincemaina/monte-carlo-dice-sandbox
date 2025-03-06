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
  const timeout = useRef<NodeJS.Timeout>(undefined);
  const timeout2 = useRef<NodeJS.Timeout>(undefined);

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
      runTrial(config.numDie);

      // Check if all iterations complete
      if (outcomes.current.length >= config.numIterations) {
        console.log("Completed simulation!");
        stopSimulation();
      }
    }, config.simulationDelay);

    // Refreshes display 29 times per second (1000ms in a second / 35ms delay)
    // This loop run indepedently of monte-carlo simulation loop above to avoid
    // performance issues due to excessive re-rendering of components.
    const REFRESH_DELAY = 35;
    timeout.current = setInterval(() => {
      setDisplayedOutcomes([...outcomes.current]);
    }, REFRESH_DELAY);

    console.log("Started simulation!");
    console.log(config);
  }

  /**
   * Clears all loops, stopping the simulation.
   */
  function stopSimulation() {
    if (timeout.current) {
      clearInterval(timeout.current);
      timeout.current = undefined;
    }

    if (timeout2.current) {
      clearInterval(timeout2.current);
      timeout2.current = undefined;
    }

    // Update displayed outcomes one final time to show complete results
    setDisplayedOutcomes([...outcomes.current]);
    setRunning(false);
    console.log("Stopped simulation!");
  }

  /**
   * Runs whenever config is updated.
   * Stars simulation if config provided, and no simulation currently running.
   * Ensures simulation is stopped when component unmounted.
   */
  useEffect(() => {
    if (config && !running) {
      console.log("Here", { config, running });
      startSimulation();
    }
  }, [config]);

  /**
   * Stop simulation when component unmounted.
   */
  useEffect(() => {
    return () => {
      stopSimulation();
    };
  }, []);

  /**
   * Handles form submission events.
   * Parses the form and updates config state.
   */
  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log("Parsing form!");

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
    <div className="flex flex-col lg:flex-row flex-grow gap-5">

      {/* Config form */}
      <form
        onSubmit={handleFormSubmit}
        className="border border-dashed bg-white p-7 rounded-xl flex lg:flex-col  items-center lg:items-start gap-5"
      >
        <label>
          <span>Number of die</span>
          <input
            type="number"
            name="input-num-die"
            min={1}
            max={1000}
            defaultValue={10}
            placeholder="Enter a number"
            disabled={running}
            required
          />
        </label>

        <label title="How many times would you like to run the simulation?">
          <span>Number of trials</span>
          <input
            type="number"
            name="input-num-iterations"
            min={1}
            defaultValue={5000}
            placeholder="Enter a number"
            disabled={running}
            required
          />
        </label>

        <label title="How many times should the simulation run per second?">
          <span>Max trials / second</span>
          <input
            type="number"
            name="input-simulation-rate"
            defaultValue={100}
            max={1000}
            min={1}
            placeholder="Enter a number"
            disabled={running}
            required
          />
        </label>

        <div className="ml-auto lg:ml-0 lg:mt-auto">
          {running
            ? <div className="!bg-rose-800 button" onClick={stopSimulation}>
              Stop Simulation
            </div>

            : <button id="run-button" type="submit">
              Start Simulation
            </button>
          }
        </div>
      </form>

      {/* Visualiser */}
      <div className="flex-grow border border-dashed bg-white rounded-xl p-7 flex flex-col">
        {
          config
            ? <SimulationVisualiser outcomes={displayedOutcomes} numIterations={config.numIterations} />
            : <div className="m-auto">Click <strong>Start Simulation</strong> in the left pane</div>
        }

      </div>
    </div >
  );
}
