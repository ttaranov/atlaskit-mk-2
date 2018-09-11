import { Node as PMNode, Schema } from 'prosemirror-model';

export default function getMediaGroupNodeView(
  schema: Schema,
  filename: string,
): PMNode {
  const { media, mediaGroup } = schema.nodes;

  const mediaNode = media.createChecked({
    id: filename,
    type: 'file',
    collection: '',
  });

  return mediaGroup.createChecked({}, mediaNode);
}
