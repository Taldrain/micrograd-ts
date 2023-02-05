import MLP from './mlp';
import Training from './training';

async function main() {
  const n = new MLP(3, [4, 4, 1]);

  const xs = [
    [2, 3, -1],
    [3, -1, 0.5],
    [0.5, 1, 1],
    [1, 1, -1],
  ];
  const ys = [1, -1, -1, 1];

  const training = new Training(n, xs, ys);
  training.train(20);
}

main();
