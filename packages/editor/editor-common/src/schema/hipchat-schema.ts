import { createSchema } from './create-schema';
import { Schema } from 'prosemirror-model';
import { doc } from './nodes/doc';

export const hipchatSchema: Schema = createSchema({
  nodes: [
    // A paragraph node.
    'paragraph',

    // Text node.
    'text',

    // The equivalent of a <br> in HTML.
    //
    // This mark is used internally and is translated to a text node with content "\n" in documents
    // exposed from getter APIs.
    'hardBreak',

    // An @-mention.
    'mention',

    // An emoji.
    'emoji',

    // Decision
    'decisionList',
    'decisionItem',

    // Task
    'taskList',
    'taskItem',

    // media
    'mediaGroup',
    'media',

    // code
    'codeBlock',

    // blockquote
    'blockquote',

    // list
    'orderedList',
    'bulletList',
    'listItem',
  ],
  marks: [
    // Represents a hyperlink to a URL.
    'link',

    // Represents an italic text
    'em',

    // Represents bolded text
    'strong',

    // Represents underlined text
    'underline',

    // Represents a "mention query". A mention query is created by typing the @ symbol. The text
    // within a mention query is used to search for a mention.
    //
    // This mark is used internally, and is stripped from documents before they are exposed through
    // the editor getter APIs.
    'mentionQuery',

    // Represents an "emoji query". An emoji query is created by typing the : symbol. The text
    // within an emoji query is used to search for an emoji.
    //
    // This mark is used internally, and is stripped from documents before they are exposed through
    // the editor getter APIs.
    'emojiQuery',

    // We are forced to add this, because link mark excludes: 'textColor'
    // Without this ProseMirror is unable to construct the schema
    'textColor',

    // Represents inline code
    'code',
  ],
  customNodeSpecs: {
    // The top level node for a document.
    doc,
  },
});
