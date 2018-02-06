import { EditorState, Transaction } from 'prosemirror-state';

export const insertPlaceholderText = () => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const { schema } = state;
  const placeholderNode = schema.nodes.placeholder.create({
    text: 'What are you saying',
  });
  dispatch(state.tr.replaceSelectionWith(placeholderNode).scrollIntoView());
  return true;
};
