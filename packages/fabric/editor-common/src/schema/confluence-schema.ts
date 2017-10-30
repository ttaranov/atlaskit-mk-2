import { createSchema } from './create-schema';
import { Schema } from 'prosemirror-model';

export const confluenceSchema: Schema = createSchema({
  nodes: [
    'doc',
    'paragraph',
    'blockquote',
    'codeBlock',
    'panel',
    'hardBreak',
    'orderedList',
    'bulletList',
    'heading',
    'mediaGroup',
    'confluenceUnsupportedBlock',
    'confluenceJiraIssue',
    'inlineMacro',
    'listItem',
    'mention',
    'text',
    'confluenceUnsupportedInline',
    'media',
    'rule',
    'table',
    'tableCell',
    'tableHeader',
    'tableRow',
    'emoji'
  ],
  marks: [
    'link',
    'em',
    'strong',
    'strike',
    'subsup',
    'underline',
    'mentionQuery',
    'code',
    'textColor',
    'confluenceInlineComment',
  ]
});
