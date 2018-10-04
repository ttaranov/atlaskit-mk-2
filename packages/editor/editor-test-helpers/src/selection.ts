import { EditorView } from 'prosemirror-view';
import { EditorInstance } from '@atlaskit/editor-core';

export type EditorFactory = (doc: any) => EditorInstance;

/**
 * Compares an expected document with selection {<>}, with the actual
 * selected state of an editor view, asserting the selection is equivalent.
 *
 * @param editorFactory a function to contruct an editor using the same configuration
 *        as used by the currentEditorView
 * @param expectedDocWithSelection document with selection
 * @param currentEditorView edit view to assert expectations again.
 */
export const compareSelection = (
  editorFactory: EditorFactory,
  expectedDocWithSelection: any,
  currentEditorView: EditorView,
) => {
  const { selection: expectedSelection } = editorFactory(
    expectedDocWithSelection,
  ).editorView.state;
  const { selection: actualSelection } = currentEditorView.state;
  expect(actualSelection.$from.pos).toEqual(expectedSelection.$from.pos);
  expect(actualSelection.$to.pos).toEqual(expectedSelection.$to.pos);
};
