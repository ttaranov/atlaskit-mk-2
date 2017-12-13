import { createSchema } from './create-schema';
import { Schema } from 'prosemirror-model';

export const defaultSchemaNodes = [
  'applicationCard',
  'blockquote',
  'bodiedExtension',
  'bulletList',
  'codeBlock',
  'confluenceJiraIssue',
  'confluenceUnsupportedBlock',
  'confluenceUnsupportedInline',
  'decisionItem',
  'decisionList',
  'doc',
  'emoji',
  'extension',
  'hardBreak',
  'heading',
  'image',
  'inlineExtension',
  'listItem',
  'media',
  'mediaGroup',
  'mediaSingle',
  'mention',
  'orderedList',
  'panel',
  'paragraph',
  'rule',
  'table',
  'tableCell',
  'tableHeader',
  'tableRow',
  'taskItem',
  'taskList',
  'text',
  'unknownBlock',
];

export const defaultSchemaMarks = [
  'action',
  'code',
  'confluenceInlineComment',
  'em',
  'emojiQuery',
  'link',
  'mentionQuery',
  'strike',
  'strong',
  'subsup',
  'textColor',
  'underline',
];

export const defaultSchema: Schema = createSchema({
  nodes: defaultSchemaNodes,
  marks: defaultSchemaMarks,
});
