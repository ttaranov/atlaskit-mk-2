import { Node as PmNode } from 'prosemirror-model';
import { EditorState, NodeSelection } from 'prosemirror-state';
import {
  findParentNodeOfType,
  findSelectedNodeOfType,
} from 'prosemirror-utils';

export const getExtensionNode = (state: EditorState): PmNode | undefined => {
  const { selection, schema } = state;
  const { extension, inlineExtension, bodiedExtension } = schema.nodes;

  if (selection instanceof NodeSelection) {
    const selectedNode = findSelectedNodeOfType([
      extension,
      inlineExtension,
      bodiedExtension,
    ])(selection);
    if (selectedNode) {
      return selectedNode.node;
    }
  }
  const parent = findParentNodeOfType(bodiedExtension)(selection);
  if (parent) {
    return parent.node;
  }
};
