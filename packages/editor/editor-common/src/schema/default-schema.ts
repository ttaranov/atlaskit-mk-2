import { createSchema } from './create-schema';
import { Schema } from 'prosemirror-model';

export const defaultSchema: Schema = createSchema({
  nodes: [
    'applicationCard',
    'doc',
    'paragraph',
    'text',
    'bulletList',
    'orderedList',
    'listItem',
    'heading',
    'blockquote',
    'codeBlock',
    'panel',
    'rule',
    'image',
    'mention',
    'media',
    'mediaGroup',
    'mediaSingle',
    'confluenceUnsupportedBlock',
    'confluenceUnsupportedInline',
    'confluenceJiraIssue',
    'extension',
    'inlineExtension',
    'bodiedExtension',
    'hardBreak',
    'emoji',
    'table',
    'tableCell',
    'tableHeader',
    'tableRow',
    'decisionList',
    'decisionItem',
    'taskList',
    'taskItem',
    'status',
    'unknownBlock',
    'date',
    'placeholder',
    'layoutSection',
    'layoutColumn',
    'inlineCard',
    'blockCard',
    'unsupportedBlock',
    'unsupportedInline',
  ],
  marks: [
    'action',
    'link',
    'em',
    'strong',
    'strike',
    'subsup',
    'underline',
    'code',
    'mentionQuery',
    'emojiQuery',
    'textColor',
    'confluenceInlineComment',
  ],
});
