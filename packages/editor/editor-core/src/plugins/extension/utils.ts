import { Node as PmNode, NodeRange } from 'prosemirror-model';
import { EditorState, NodeSelection } from 'prosemirror-state';

export const getExtensionNode = (state: EditorState): PmNode | undefined => {
  const { selection } = state;
  const { extension, inlineExtension, bodiedExtension } = state.schema.nodes;

  if (selection instanceof NodeSelection) {
    const { node } = selection;
    if (
      node.type === extension ||
      node.type === inlineExtension ||
      node.type === bodiedExtension
    ) {
      return node;
    }
  }
  const { $from } = selection;

  for (let i = $from.depth; i > 0; i--) {
    const node = $from.node(i);
    if (
      node.type === extension ||
      node.type === inlineExtension ||
      node.type === bodiedExtension
    ) {
      return node;
    }
  }
};

export const getExtensionRange = (state: EditorState): NodeRange => {
  const { tr: { doc }, selection: { $from, $to } } = state;
  const { extension, inlineExtension, bodiedExtension } = state.schema.nodes;
  let depth;

  for (let i = $from.depth; i > 0; i--) {
    const node = $from.node(i);
    if (
      node.type === extension ||
      node.type === inlineExtension ||
      node.type === bodiedExtension
    ) {
      depth = i;
      break;
    }
  }

  const start = doc.resolve($from.start(depth));
  const end = doc.resolve($to.end(depth));
  return start.blockRange(end)!;
};
