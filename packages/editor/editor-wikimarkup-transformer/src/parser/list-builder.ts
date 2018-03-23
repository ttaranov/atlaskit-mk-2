import { Node as PMNode, Schema } from 'prosemirror-model';

export interface ListItem {
  content?: any[];
  parent: List;
  child?: List;
}

export interface List {
  children: ListItem[];
  parent?: ListItem;
}

export default class ListBuilder {
  private schema: Schema;
  private root: List;
  private listType: 'bulletList' | 'orderedList';
  private lastDepth: number;
  private lastList: List;

  constructor(schema: Schema, style: string) {
    this.schema = schema;
    this.listType = /#/.test(style) ? 'orderedList' : 'bulletList';
    this.lastDepth = 1;
    this.root = { children: [] };
    this.lastList = this.root;
  }

  /**
   * Add a list item to the builder
   * @param {string} listMarks
   * @param {PMNode} content
   */
  add(listMarks: string, content: PMNode[]) {
    const depth = listMarks.length;

    if (depth > this.lastDepth) {
      // Add children starting from last node
      this.createNest(depth - this.lastDepth);
      this.lastDepth = depth;
      this.lastList = this.addListItem(content);
    } else if (depth === this.lastDepth) {
      // Add list item to current node
      this.lastList = this.addListItem(content);
    } else {
      // Find node at depth and add list item
      this.lastList = this.findAncestor(this.lastDepth - depth);
      this.lastDepth = depth;
      this.lastList = this.addListItem(content);
    }
  }

  /**
   * Compile a prosemirror node from the root list
   * @returns {PMNode}
   */
  buildPMNode() {
    return this.buildListNode(this.root);
  }

  /**
   * Build prosemirror bulletList or orderedList node
   * @param {List} list
   * @returns {PMNode}
   */
  private buildListNode(list: List): PMNode {
    const listNode = this.schema.nodes[this.listType];

    return listNode.create(
      {},
      list.children.map(this.buildListItemNode.bind(this)),
    );
  }

  /**
   * Build prosemirror listItem node
   * @param {ListItem} item
   */
  private buildListItemNode(item: ListItem): PMNode {
    const { listItem } = this.schema.nodes;
    let content: PMNode[] = [];

    if (item.child) {
      content.push(this.buildListNode(item.child));
    }

    return listItem.create({}, [...item.content, ...content]);
  }

  /**
   * Add an item at the same level as the current list item
   * @param {PMNode} content
   * @returns {PMNode}
   */
  private addListItem(content: PMNode[]): List {
    const list = this.lastList;
    const listItem: ListItem = { content, parent: list };
    list.children = [...list.children, listItem];

    return list;
  }

  /**
   * Created a nested list structure of N depth under the current node
   * @param {number} depth
   */
  private createNest(depth: number) {
    while (depth-- > 0) {
      if (this.lastList.children.length === 0) {
        const listItem = { parent: this.lastList };
        this.lastList.children = [listItem];
      }

      const nextItem = this.lastList.children[
        this.lastList.children.length - 1
      ];

      nextItem.child = {
        children: [],
        parent: nextItem,
      };

      this.lastList = nextItem.child;
    }
  }

  /**
   * Find the Nth list ancestor of the current list
   * @param {number} depth
   */
  private findAncestor(depth: number) {
    let list: List = this.lastList;
    while (depth-- > 0 && list.parent) {
      const listItem = list.parent;
      if (listItem && listItem.parent) {
        list = listItem.parent;
      }
    }
    return list;
  }
}
