import { Node } from 'prosemirror-model';

class GraphTransformer {
  private node: Node;

  constructor(node) {
    this.node = node;
  }

  toChart(chartType) {
    return {};
  }
}

export { GraphTransformer };
