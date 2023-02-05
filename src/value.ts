import { v4 as uuidv4 } from 'uuid';

export default class Value {
  readonly prev: Set<Value>;
  readonly op: string;
  readonly id: string = uuidv4();

  data: number;
  grad: number;
  _backward: () => void;
  label: string;

  constructor(data: number, label: string = '', children: Value[] = [], op: string = '') {
    this.data = data;
    this.grad = 0;
    this._backward = () => null;
    this.prev = new Set(children)
    this.op = op;
    this.label = label;
  }

  toString() {
    return `Value(data=${this.data})`;
  }

  add(i: Value | number): Value {
    const other = (i instanceof Value) ? i : new Value(i);
    const res = new Value(this.data + other.data, '', [this, other], '+');

    res._backward = () => {
      this.grad += 1 * res.grad;
      other.grad += 1 * res.grad;
    };
    return res;
  }

  sub(i: Value | number): Value {
    const other = (i instanceof Value) ? i : new Value(i);
    return this.add(other.mul(-1));
  }

  mul(i: Value | number): Value {
    const other = (i instanceof Value) ? i : new Value(i);
    const res = new Value(this.data * other.data, '', [this, other], '*');
    res._backward = () => {
      this.grad += other.data * res.grad;
      other.grad += this.data * res.grad;
    };
    return res;
  }

  pow(i: number): Value {
    const res = new Value(this.data**i, '', [this], `**${i}`);

    res._backward = () => {
      this.grad += i * (this.data ** (i-1)) * res.grad;
    };

    return res;
  }

  div(i: Value | number): Value {
    const other = (i instanceof Value) ? i : new Value(i);

    return this.mul(other.pow(-1));
  }


  tanh(): Value {
    const res = new Value((Math.exp(2 * this.data) - 1) / (Math.exp(2 * this.data) + 1), '', [this], 'tanh');

    res._backward = () => {
      this.grad += (1 - res.data**2) * res.grad;
    };

    return res;
  }

  exp(): Value {
    const res = new Value(Math.exp(this.data), '', [this], 'exp');

    res._backward = () => {
      this.grad += res.data * res.grad;
    };

    return res;
  }

  backward() {
    this.grad = 1;

    const nodes: Value[] = []
    const visited = new Set<Value>();

    function dfs(node: Value) {
      if (!visited.has(node)) {
        visited.add(node);
        node.prev.forEach(child => {
          dfs(child);
        });
        nodes.unshift(node);
      }
    }

    dfs(this);

    nodes.forEach(node => node._backward());
  }
}
