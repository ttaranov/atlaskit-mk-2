import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import { RefsNode, Refs, coerce, offsetRefs } from './schema-builder';

/**
 * Replace the given range, or the selection if no range is given, with a text node containing the given string
 */
export function insertText(
  view: EditorView,
  text: string,
  from: number,
  to?: number,
) {
  let pos = from;

  text.split('').forEach((character, index) => {
    if (
      !view.someProp('handleTextInput', f =>
        f(view, pos + index, pos + index, character),
      )
    ) {
      view.dispatch(
        view.state.tr.insertText(character, pos + index, pos + index),
      );
    }
  });
}

export type BuilderContent = (schema: Schema) => RefsNode | RefsNode[];

const processText = (schema, content: Array<string>) => coerce(content, schema);
const processNodeMark = (schema, content: BuilderContent) => {
  const nodes = content(schema);
  const refs = ([] as RefsNode[])
    .concat(nodes)
    .reduce((acc, node) => ({ ...acc, ...node.refs }), {});
  return { nodes, refs };
};

/**
 * Replace the current selection with the given content, which may be a fragment, node, or array of nodes.
 *
 * @returns refs from the inserted nodes, made relative to the document
 *   insertion position
 */
export function insert(
  view: EditorView,
  content: Array<string> | BuilderContent,
): Refs {
  const { state } = view;
  const { from, to } = state.selection;
  const { nodes, refs } = Array.isArray(content)
    ? processText(state.schema, content)
    : processNodeMark(state.schema, content);
  const tr = state.tr.replaceWith(from, to, nodes);
  view.dispatch(tr);
  return offsetRefs(refs, from);
}
