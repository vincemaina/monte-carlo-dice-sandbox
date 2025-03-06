import { Outcome } from "./monte-carlo";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  outcomes: Outcome[],
  numIterations: number
}

export type OutcomeProbabilities = { [value: number]: number }

export function SimulationVisualiser({ outcomes, numIterations }: Props) {
  // Compute frequency distribution
  const frequencyData = useMemo(() => {
    const counts: Record<number, number> = {};
    const total = outcomes.length;

    // Count occurrences of each sum
    outcomes.forEach(({ sum }) => {
      counts[sum] = (counts[sum] || 0) + 1;
    });

    // Convert counts to percentage
    return Object.entries(counts).map(([sum, count]) => ({
      sum: Number(sum),
      percentage: ((count / total) * 100).toFixed(2), // Round to 2 decimal places
    }));
  }, [outcomes]);

  const expectedValue = frequencyData.reduce((acc, { sum, percentage }) => {
    return acc + sum * parseFloat(percentage) / 100;
  }, 0);

  return (
    <div className="flex-grow flex flex-col">
      <h2 className="font-black text-xl mb-10">Outcome Distribution</h2>
      <ResponsiveContainer width="100%" className="flex-grow">
        <BarChart data={frequencyData}>
          <XAxis dataKey="sum" />
          <YAxis label={{ value: "Percentage", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="percentage" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex-shrink-1">
        <div>Expected value: {expectedValue.toFixed(2)}</div>
        <div>Trials completed: {outcomes.length}</div>
        <div
          className="bg-lime-500 w-full h-4 rounded mt-3"
          style={{ maxWidth: `${(outcomes.length / numIterations) * 100}%` }}
        />
      </div>
    </div>
  );
}
