import Value from './value';

function random() {
  return Math.random() * (Math.round(Math.random()) ? 1 : -1)
}

export default class Neuron {
  readonly w: Value[];
  readonly b: Value;

  constructor(numberInputs: number) {
    this.w = [...Array(numberInputs).keys()].map(() => new Value(random()));
    this.b = new Value(random());
  }

  call(x: Value[]): Value {
    // w * x + b
    const act = this.w.reduce((acc, cur, idx) => {
      return acc.add(cur.mul(x[idx]))
    }, this.b);
    return act.tanh();
  }

  parameters(): Value[] {
    return [...this.w, this.b];
  }
}
