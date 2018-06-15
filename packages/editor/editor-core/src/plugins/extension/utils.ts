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

  let selectedExtNode = findParentNodeOfType([
    extension,
    inlineExtension,
    bodiedExtension,
  ])(selection);

  if (
    isNodeSelection(selection) &&
    findSelectedNodeOfType([extension, bodiedExtension, inlineExtension])(
      selection,
    )
  ) {
    selectedExtNode = {
      node: (selection as NodeSelection).node,
      pos: selection.$from.pos,
    };
  }

  return selectedExtNode;
};
