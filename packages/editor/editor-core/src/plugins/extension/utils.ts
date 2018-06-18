import { Node as PmNode } from 'prosemirror-model';
import { EditorState, NodeSelection } from 'prosemirror-state';
import {
  findParentNodeOfType,
  findSelectedNodeOfType,
  isNodeSelection,
} from 'prosemirror-utils';

type ExtensionNode =
  | {
      node: PmNode;
      pos: number;
    }
  | undefined;

export const getExtensionNode = (state: EditorState): ExtensionNode => {
  const { selection } = state;
  const { extension, inlineExtension, bodiedExtension } = state.schema.nodes;

  if (
    isNodeSelection(selection) &&
    findSelectedNodeOfType([extension, bodiedExtension, inlineExtension])(
      selection,
    )
  ) {
    return {
      node: (selection as NodeSelection).node,
      pos: selection.$from.pos,
    };
  }

  return findParentNodeOfType([extension, inlineExtension, bodiedExtension])(
    selection,
  );
};
