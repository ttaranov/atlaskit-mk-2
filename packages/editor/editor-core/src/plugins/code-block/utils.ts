import { Node, Slice, Fragment } from 'prosemirror-model';
import { mapSlice } from '../../utils/slice';

function joinCodeBlocks(left: Node, right: Node) {
  const textContext = `${left.textContent!}\n${right.textContent!}`;
  return left.type.create(left.attrs, left.type.schema.text(textContext));
}

function mergeAdjacentCodeBlocks(fragment: Fragment): Fragment {
  const children = [] as Node[];
  fragment.forEach(maybeCodeBlock => {
    if (maybeCodeBlock.type === maybeCodeBlock.type.schema.nodes.codeBlock) {
      const peekAtPrevious = children[children.length - 1];
      if (peekAtPrevious && peekAtPrevious.type === maybeCodeBlock.type) {
        return children.push(joinCodeBlocks(children.pop()!, maybeCodeBlock));
      }
    }
    children.push(maybeCodeBlock);
  });
  return Fragment.from(children);
}

export function transformSliceToJoinAdjacentCodeBlocks(slice: Slice): Slice {
  slice = mapSlice(slice, node => {
    return node.isBlock && !node.isTextblock
      ? node.copy(mergeAdjacentCodeBlocks(node.content))
      : node;
  });
  // mapSlice won't be able to merge adjacent top-level code-blocks
  return new Slice(
    mergeAdjacentCodeBlocks(slice.content),
    slice.openStart,
    slice.openEnd,
  );
}
