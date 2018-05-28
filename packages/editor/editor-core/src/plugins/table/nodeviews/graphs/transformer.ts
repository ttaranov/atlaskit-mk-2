import { Node } from 'prosemirror-model';

interface GraphTransformer {
  toChart: () => object[];
  fromChart: (chartData: object[]) => Node;
}

class PieTransformer implements GraphTransformer {
  private node: Node;

  constructor(node) {
    this.node = node;
  }

  toChart() {
    return [12, 23, 23, 23];
  }

  fromChart(obj) {
    return this.node;
  }
}

export { PieTransformer, GraphTransformer };
