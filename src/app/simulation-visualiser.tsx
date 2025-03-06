import { Outcome } from "./monte-carlo";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  outcomes: Outcome[]
}

export type OutcomeProbabilities = { [value: number]: number }

export function SimulationVisualiser({ outcomes }: Props) {
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
    <div style={{ width: "100%", height: 500 }}>
      <h2 className="mb-10">Outcome Distribution</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={frequencyData}>
          <XAxis dataKey="sum" />
          <YAxis label={{ value: "Percentage", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="percentage" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <div>Expected value: {expectedValue.toFixed(2)}</div>
      <div>Number of simulations: {outcomes.length}</div>
    </div>
  );
}
