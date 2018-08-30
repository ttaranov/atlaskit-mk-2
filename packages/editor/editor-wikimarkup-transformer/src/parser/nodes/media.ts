import { Node as PMNode, Schema, NodeType } from 'prosemirror-model';
import { parseAttrs } from '../utils/attributeParser';

export default function getMediaNodeView(
  schema: Schema,
  matches: RegExpMatchArray,
): PMNode {
  const { media, mediaSingle, mediaGroup } = schema.nodes;
  const filename: string = matches[1];
  const dimensions = {};
  let node: NodeType = mediaGroup;

  if (matches[2]) {
    const attrs = parseAttrs(matches[2], ',');

    if (attrs.width && attrs.height) {
      node = mediaSingle;
      dimensions['width'] = attrs.width;
      dimensions['height'] = attrs.height;
    }
  }
  const mediaNode = media.createChecked({
    id: filename,
    type: 'file',
    collection: '',
    ...dimensions,
  });

  return node.createChecked({ layout: 'wide' }, mediaNode);
}
