import { writeFile } from 'node:fs/promises';

import { Digraph, Node, Edge, toDot } from 'ts-graphviz';

import type Value from './value';

function formatNumber(n: number) {
  return Math.round(n * 10_000) / 10_000;
}

export default async function draw(root: Value) {
  const g = new Digraph({ rankdir: 'LR' });
  const visited = new Set<Value>()

  function dfs(node: Value, previousNode: Node | undefined = undefined) {
    const label = `{${node.label}|data ${formatNumber(node.data)}|grad ${formatNumber(node.grad)}}`;
    const nodeNode = new Node(node.id, { label, shape: 'record' });
    g.addNode(nodeNode);
    if (previousNode) {
      g.addEdge(new Edge([nodeNode, previousNode]));
    }

    let opNode: Node | undefined;
    if (node.op !== '') {
      opNode = new Node(`${node.id}${node.op}`, { label: node.op });
      g.addNode(opNode);
      g.addEdge(new Edge([opNode, nodeNode]));
    }

    node.prev.forEach(child => {
      if (!visited.has(child)) {
        visited.add(child)
        dfs(child, opNode);
      }
    });
  }

  dfs(root);

  await writeFile('./result.dot', toDot(g));
}
