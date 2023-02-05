import Value from './value';
import Neuron from './neuron';

export default class Layer {
  readonly neurons: Neuron[];

  constructor(numberInputs: number, numberOutputs: number) {
    this.neurons = [...Array(numberOutputs).keys()].map(() => new Neuron(numberInputs));
  }

  call(x: Value[]): Value[] {
    return this.neurons.map(n => n.call(x));
  }

  parameters(): Value[] {
    return this.neurons.reduce((acc: Value[], cur: Neuron) => {
      return [...cur.parameters(), ...acc];
    }, []);
  }
}
