# Monte Carlo Dice Simulation 🎲

This is a [Next.js](https://nextjs.org) project that visualises a **Monte Carlo simulation** for rolling dice.
The simulation repeatedly rolls a set of dice and visualises the probability distribution of different sums over time.

## 🚀 Features

- Real-time Monte Carlo simulation of dice rolls
- Interactive controls for configuring the number of dice, iterations, and speed
- Live-updating probability distribution graph
- Responsive UI built with Next.js

## How to Use

1. Enter the **number of dice** to roll per trial.
2. Set the **number of trials** (how many dice rolls to simulate).
3. Adjust the **max simulation speed** (rolls per second).
4. Click **"Run Simulation"** to start.
5. The graph will update in real-time to reflect probabilities.
6. Click **"Stop Simulation"** to halt the process.

## Technologies Used

- Next.js – React framework for SSR and performance
- TypeScript – Type safety and maintainability
- Recharts – Data visualization for the probability distribution
- CSS/Tailwind – UI styling

## License

This project is licensed under the MIT License.

## Installation

If you'd like to run the project yourself, first, clone the repository:

```bash
git clone https://github.com/yourusername/monte-carlo-dice-sim.git
cd monte-carlo-dice-sim
```

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the simulation tool.
