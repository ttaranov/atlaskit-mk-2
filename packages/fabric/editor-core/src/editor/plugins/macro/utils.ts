import { Node as PmNode } from 'prosemirror-model';

export interface Params {
  node: PmNode;
  type: 'image' | 'icon';
}

export const getPlaceholderUrl = ({
  node,
  type,
}: Params): string | undefined => {
  if (!node.attrs.parameters) {
    return;
  }
  const { macroMetadata } = node.attrs.parameters;
  if (macroMetadata && macroMetadata.placeholder) {
    let placeholderUrl;
    macroMetadata.placeholder.forEach(placeholder => {
      if (placeholder.type === type) {
        placeholderUrl = placeholder.data.url;
      }
    });

    return placeholderUrl;
  }
};

export const getMacroId = (node: PmNode): string | undefined => {
  if (!node.attrs.parameters) {
    return;
  }
  const { macroMetadata } = node.attrs.parameters;
  if (macroMetadata && macroMetadata.macroId) {
    return macroMetadata.macroId.value;
  }
};
