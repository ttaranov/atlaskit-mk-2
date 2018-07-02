import { Node, Fragment, Slice } from 'prosemirror-model';

export function mapFragment(
  content: Fragment,
  callback: (node: Node, parent: Node | null, index: number) => Node | Node[],
  parent: Node | null = null,
) {
  const children = [] as Node[];
  for (let i = 0, size = content.childCount; i < size; i++) {
    const node = content.child(i);
    const transformed = node.isLeaf
      ? callback(node, parent, i)
      : callback(
          node.copy(mapFragment(node.content, callback, node)),
          parent,
          i,
        );

    Array.isArray(transformed)
      ? children.push(...transformed)
      : children.push(transformed);
  }
  return Fragment.fromArray(children);
}

export function mapSlice(
  slice: Slice,
  callback: (nodes: Node, parent: Node | null, index: number) => Node | Node[],
): Slice {
  const fragment = mapFragment(slice.content, callback);
  return new Slice(fragment, slice.openStart, slice.openEnd);
}
