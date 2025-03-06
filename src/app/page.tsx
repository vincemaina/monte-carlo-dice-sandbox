import { MonteCarlo } from "./monte-carlo";

export default function Home() {
  return (
    <div className="container p-10 max-w-[1500px] mx-auto">
      <h1 className="font-black text-xl">Monte Carlo Sandbox</h1>
      <MonteCarlo
        numIterations={10000}
        numDice={100}
        simulationRate={1}
      />
    </div>
  );
}
