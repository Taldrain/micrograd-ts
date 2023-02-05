import Value from './value';
import MLP from './mlp';

export default class Training {
  readonly n: MLP;
  readonly xs: Value[][];
  readonly ys: number[];


  constructor(n: MLP, xs: number[][], ys: number[]) {
    this.n = n;
    this.xs = xs.map(i => i.map(j => new Value(j)));
    this.ys = ys;
  }

  private computeLoss(ypred: Value[]): Value {
    return this.ys.reduce((acc, cur, idx) => {
      return (ypred[idx]).sub(cur).pow(2).add(acc);
    }, new Value(0));
  }

  train(steps: number, learningRate: number = 0.05) {
    let ypred: Value[] = [];
    [...Array(steps).keys()].forEach(step => {
      // forward pass
      ypred = this.xs.map(i => this.n.call(i));
      const loss = this.computeLoss(ypred);

      // backward pass
      this.n.parameters().forEach((i: Value) => i.grad = 0);
      loss.backward();

      // update
      this.n.parameters().forEach((i: Value) => {
        i.data += -(learningRate * i.grad);
      });

      console.log(`Step: ${step} - Loss: ${loss.data}`);
    });

    console.log('ypred: ', ypred.map(i => i.data));
  }
}
