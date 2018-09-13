import { Node as PMNode } from 'prosemirror-model';
import ResizeState from './resizeState';
import Column from './column';

import { renderColgroupFromNode } from '../../../utils';

export interface ResizerConfig {
  minWidth: number;
  maxSize: number;
  node: PMNode;
}

export default class Resizer {
  tableElem: HTMLTableElement;
  handleElem: HTMLElement;
  minWidth: number;
  maxSize: number;
  node: PMNode;
  currentState: ResizeState | null;
  colgroupChildren: HTMLCollection;

  constructor(tableElem: HTMLTableElement, config: ResizerConfig) {
    this.tableElem = tableElem;
    this.minWidth = config.minWidth;
    this.maxSize = config.maxSize;
    this.node = config.node;

    // load initial state from DOM
    this.colgroupChildren = recreateResizeColsByNode(this.tableElem, this.node);

    this.currentState = this.reload();
  }

  /**
   * Reloads the current column resize state from the DOM.
   */
  reload() {
    const col = this.colgroupChildren;
    let cols = [] as Column[];
    for (let i = 0; i < col.length; i++) {
      cols.push(Column.fromDOM(this.tableElem, i, this.minWidth));
    }

    this.currentState = new ResizeState(cols, this.maxSize);
    return this.currentState;
  }

  /**
   * Applies a resize state with the DOM. Does not update state.
   */
  apply(state: ResizeState) {
    const colElems = this.colgroupChildren;
    state.cols.forEach((col, i) => {
      // If width is 0, we dont want to apply that.
      if (col.width) {
        (colElems[i] as HTMLElement).style.width = `${col.width}px`;
      }
    });
  }

  /**
   * Applies the column resize state to the DOM, and sets it for future use.
   */
  update(state: ResizeState) {
    this.apply(state);
    this.currentState = state;
  }

  /**
   * Resize a given column by an amount from the current state, and return the new state.
   * You can then either #apply this new state to the DOM while dragging resize handles, or #update the resizer state when resizing is finished (typically when the user releases the resize handle)
   * @param {number} col The column index to resixze
   * @param {number} amount Delta of pixels to resize by. Can be positive or negative.
   */
  resize(col: number, amount: number): ResizeState {
    if (this.currentState) {
      return this.currentState.resize(col, amount);
    }
    return this.currentState!;
  }

  scale(newSize: number) {
    this.colgroupChildren = recreateResizeColsByNode(this.tableElem, this.node);
    this.currentState = this.currentState!.scale(newSize);
    this.maxSize = newSize;
    this.apply(this.currentState!);

    return this.currentState;
  }

  getCol(colIdx: number) {
    return this.currentState!.cols[colIdx];
  }
}

function recreateResizeColsByNode(
  table: HTMLTableElement,
  node: PMNode,
): HTMLCollection {
  let colgroup = table.querySelector('colgroup') as HTMLElement;
  if (colgroup) {
    table.removeChild(colgroup);
  }

  colgroup = renderColgroupFromNode(node) as HTMLElement;
  table.insertBefore(colgroup, table.firstChild);

  return colgroup.children;
}
