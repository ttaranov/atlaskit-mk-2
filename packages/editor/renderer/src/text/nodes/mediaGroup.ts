import { Node as PMNode } from 'prosemirror-model';
import { ReducedNode } from './';

export default function mediaGroup(node: PMNode): ReducedNode {
  // count children which are media files
  // ignore card links
  let childMediaFilesCount = 0;

  node.content.forEach(childNode => {
    if (childNode.attrs.type === 'file') {
      childMediaFilesCount += 1;
    }
  });

  const reducedNode: ReducedNode = {};

  if (childMediaFilesCount) {
    const postfix = childMediaFilesCount > 1 ? 'Files' : 'File';
    reducedNode.text = `📎 ${childMediaFilesCount} ${postfix}`;
  }

  return reducedNode;
}
