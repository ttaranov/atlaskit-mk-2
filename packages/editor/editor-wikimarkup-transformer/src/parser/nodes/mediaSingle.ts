import { Node as PMNode, Schema } from 'prosemirror-model';

const defaultWidth = 200;
const defaultHeight = 183;

export default function getMediaSingleNodeView(
  schema: Schema,
  filename: string,
  attrs: { [key: string]: string },
): PMNode {
  const { media, mediaSingle } = schema.nodes;
  let width = defaultWidth;
  let height = defaultHeight;

  if (attrs.width) {
    const parsed = parseInt(attrs.width, 10);
    if (!isNaN(parsed)) {
      width = parsed;
    }
  }

  if (attrs.height) {
    const parsed = parseInt(attrs.height, 10);
    if (!isNaN(parsed)) {
      height = parsed;
    }
  }

  const mediaNode = media.createChecked({
    id: filename,
    type: 'file',
    collection: '',
    width,
    height,
  });

  return mediaSingle.createChecked({}, mediaNode);
}
