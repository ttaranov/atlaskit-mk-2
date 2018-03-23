import { Node as PMNode, Schema } from 'prosemirror-model';

export interface ListItem {
  content?: any[];
  parent: List;
  children: List[];
}

export interface List {
  children: ListItem[];
  type: ListType;
  parent?: ListItem;
}

export type ListType = 'bulletList' | 'orderedList';

export default class ListBuilder {
  private schema: Schema;
  private root: List;
  private lastDepth: number;
  private lastList: List;

  constructor(schema: Schema, bullets: string) {
    this.schema = schema;
    this.root = { children: [], type: this.getType(bullets) };
    this.lastDepth = 1;
    this.lastList = this.root;
  }

  /**
   * Add a list item to the builder
   * @param {string} bullets
   * @param {PMNode} content
   */
  add(bullets: string, content: PMNode[]) {
    const depth = bullets.length;
    const type = this.getType(bullets);

    if (depth > this.lastDepth) {
      // Add children starting from last node
      this.createNest(depth - this.lastDepth, type);
      this.lastDepth = depth;
      this.lastList = this.addListItem(type, content);
    } else if (depth === this.lastDepth) {
      // Add list item to current node
      this.lastList = this.addListItem(type, content);
    } else {
      // Find node at depth and add list item
      this.lastList = this.findAncestor(this.lastDepth - depth);
      this.lastDepth = depth;
      this.lastList = this.addListItem(type, content);
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
    const listNode = this.schema.nodes[list.type];

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
    let content: any[] = [];

    content.push(...item.children.map(this.buildListNode.bind(this)));

    if (!item.content) {
      return listItem.create({}, content);
    }

    return listItem.create({}, [...item.content, ...content]);
  }

  /**
   * Add an item at the same level as the current list item
   * @param {ListType} type
   * @param {PMNode} content
   * @returns {PMNode}
   */
  private addListItem(type: ListType, content: PMNode[]): List {
    let list = this.lastList;

    // If the list is a different type, create a new list and add it to the parent node
    if (list.type !== type) {
      const parent = list.parent;
      const newList = {
        children: [],
        type,
        parent,
      };
      parent.children.push(newList);
      this.lastList = list = newList;
    }

    const listItem: ListItem = { content, parent: list, children: [] };
    list.children = [...list.children, listItem];

    return list;
  }

  /**
   * Created a nested list structure of N depth under the current node
   * @param {number} depth
   * @param {ListType} type
   */
  private createNest(depth: number, type: ListType) {
    while (depth-- > 0) {
      if (this.lastList.children.length === 0) {
        const listItem = { parent: this.lastList };
        this.lastList.children = [listItem];
      }

      const nextItem = this.lastList.children[
        this.lastList.children.length - 1
      ];

      nextItem.children = [
        {
          children: [],
          parent: nextItem,
          type,
        },
      ];

      this.lastList = nextItem.children[0];
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

  /**
   * Return the type of a list from the bullets
   * @param {string} bullets
   * @returns {ListType}
   */
  private getType(bullets: string): ListType {
    return /#/.test(bullets) ? 'orderedList' : 'bulletList';
  }
}
