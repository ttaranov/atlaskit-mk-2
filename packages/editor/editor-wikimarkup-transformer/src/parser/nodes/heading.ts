import { Node as PMNode, NodeType, Schema } from 'prosemirror-model';

import { getTextWithMarks } from '../text';
import { TEXT_BOLD, TEXT_COLOR_GREY, TEXT_ITALIC } from '../effects';

export default function getHeadingNodeView(
  schema: Schema,
  containerNodeType: NodeType | null,
  attrs: { [key: string]: any },
  text: string,
  useGreyText: boolean,
): PMNode {
  if (!containerNodeType) {
    const extraEffects = useGreyText ? [TEXT_COLOR_GREY] : [];
    const textNodes = getTextWithMarks(schema, text, extraEffects);

    return schema.nodes.heading.createChecked(attrs, textNodes);
  }

  const level = Number(attrs.level);
  const { paragraph } = schema.nodes;

  switch (level) {
    case 1: {
      const textNodes = getTextWithMarks(schema, text.toUpperCase(), [
        TEXT_BOLD,
      ]);
      return paragraph.createChecked(attrs, textNodes);
    }

    case 2: {
      const textNodes = getTextWithMarks(schema, text, [
        TEXT_BOLD,
        TEXT_ITALIC,
      ]);
      return paragraph.createChecked(attrs, textNodes);
    }

    case 3: {
      const textNodes = getTextWithMarks(schema, text, [TEXT_BOLD]);
      return paragraph.createChecked(attrs, textNodes);
    }

    case 4: {
      const textNodes = getTextWithMarks(schema, text, [
        TEXT_BOLD,
        TEXT_COLOR_GREY,
      ]);
      return paragraph.createChecked(attrs, textNodes);
    }

    case 5: {
      const textNodes = getTextWithMarks(schema, text, [
        TEXT_ITALIC,
        TEXT_COLOR_GREY,
      ]);
      return paragraph.createChecked(attrs, textNodes);
    }

    case 6: {
      const textNodes = getTextWithMarks(schema, text, [TEXT_COLOR_GREY]);
      return paragraph.createChecked(attrs, textNodes);
    }

    default:
      throw new Error(`Unknown heading level: ${level}`);
  }
}
