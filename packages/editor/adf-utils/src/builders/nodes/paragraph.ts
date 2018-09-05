import {
  ActionDefinition,
  CodeDefinition,
  DateDefinition,
  EmDefinition,
  EmojiDefinition,
  HardBreakDefinition,
  InlineExtensionDefinition,
  LinkDefinition,
  MarksObject,
  MentionDefinition,
  PlaceholderDefinition,
  StrikeDefinition,
  StrongDefinition,
  SubSupDefinition,
  TextColorDefinition,
  TextDefinition,
  UnderlineDefinition,
  ParagraphDefinition,
  Inline,
  InlineCardDefinition,
  StatusDefinition,
} from '@atlaskit/editor-common';
import { createTextNodes } from '../utils/create-text-nodes';

export const paragraph = (
  ...content: Array<Inline | string>
): ParagraphDefinition => ({
  type: 'paragraph',
  content: createTextNodes(content),
});

export {
  ActionDefinition,
  CodeDefinition,
  DateDefinition,
  EmDefinition,
  EmojiDefinition,
  HardBreakDefinition,
  InlineExtensionDefinition,
  LinkDefinition,
  MarksObject,
  MentionDefinition,
  PlaceholderDefinition,
  StrikeDefinition,
  StrongDefinition,
  SubSupDefinition,
  TextColorDefinition,
  TextDefinition,
  UnderlineDefinition,
  ParagraphDefinition,
  Inline,
  InlineCardDefinition,
  StatusDefinition,
};
