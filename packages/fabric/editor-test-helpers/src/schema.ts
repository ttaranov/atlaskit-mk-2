import { AttributeSpec, MarkSpec, Node, NodeSpec, ParseRule, Schema } from 'prosemirror-model';
import {
  paragraph,
  createSchema
} from '@atlaskit/editor-common';

export { AttributeSpec, MarkSpec, Node, NodeSpec, ParseRule, Schema };
export default createSchema({
  nodes: [
    'doc',
    'applicationCard',
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
    'hardBreak',
    'mention',
    'emoji',
    'image',
    'media',
    'mediaGroup',
    'confluenceUnsupportedBlock',
    'confluenceUnsupportedInline',
    'confluenceJiraIssue',
    'singleImage',
    'plain',
    'table',
    'tableCell',
    'tableHeader',
    'tableRow',
    'decisionList',
    'decisionItem',
    'taskList',
    'taskItem',
    'inlineMacro',
  ],
  marks: [
    'em',
    'strong',
    'code',
    'strike',
    'underline',
    'link',
    'mentionQuery',
    'subsup',
    'emojiQuery',
    'textColor',
  ],
  customNodeSpecs: {
    plain: { ...paragraph, content: 'text*', marks: '' }
  }
});
