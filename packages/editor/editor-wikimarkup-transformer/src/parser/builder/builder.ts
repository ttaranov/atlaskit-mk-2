import { Node as PMNode } from 'prosemirror-model';

export interface AddArgs {
  style: string | null;
  content: PMNode[];
}

export interface Builder {
  /**
   * Add a item to the builder
   * @param {AddCellArgs[]} items
   */
  add(items: AddArgs[]): void;

  /**
   * Compile a prosemirror node from the root list
   * @returns {PMNode}
   */
  buildPMNode(): PMNode;
}
