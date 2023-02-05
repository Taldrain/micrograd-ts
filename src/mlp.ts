import Value from './value';
import Layer from './layer';

// multilayer perceptron
export default class MLP {
  readonly layers: Layer[];
  constructor(numberInputs: number, listNumberOutputs: number[]) {
    const sz = [numberInputs, ...listNumberOutputs];
    this.layers = [...Array(listNumberOutputs.length).keys()].map(i => new Layer(sz[i], sz[i + 1]));

  }

  call(x: Value[]): Value {
    const res = this.layers.reduce((acc, cur) => {
      return cur.call(acc)
    }, x);

    if (res.length !== 1) {
      throw new Error('MLP result should be a single Value');
    }

    return res[0];
  }

  parameters(): Value[] {
    return this.layers.reduce((acc: Value[], cur: Layer) => {
      return [...cur.parameters(), ...acc];
    }, []);
  }
}
