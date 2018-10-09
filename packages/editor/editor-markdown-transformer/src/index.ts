import { defaultSchema, Transformer } from '@atlaskit/editor-common';
import * as MarkdownIt from 'markdown-it';
import { markdownItTable } from 'markdown-it-table';
import { MarkdownParser } from 'prosemirror-markdown';
import { Schema, Node as PMNode } from 'prosemirror-model';
import { markdownItMedia } from './media';

function filterMdToPmSchemaMapping(schema: Schema, map: any) {
  return Object.keys(map).reduce((newMap, key) => {
    const value = map[key];
    const block = value.block || value.node;
    const mark = value.mark;

    if ((block && schema.nodes[block]) || (mark && schema.marks[mark])) {
      newMap[key] = value;
    }
    return newMap;
  }, {});
}

const pmSchemaToMdMapping = {
  nodes: {
    blockquote: 'blockquote',
    paragraph: 'paragraph',
    rule: 'hr',
    // lheading (---, ===)
    heading: ['heading', 'lheading'],
    codeBlock: ['code', 'fence'],
    listItem: 'list',
    image: 'image',
  },
  marks: {
    em: 'emphasis',
    strong: 'text',
    link: ['link', 'autolink', 'reference', 'linkify'],
    strike: 'strikethrough',
    code: 'backticks',
  },
};

const mdToPmMapping = {
  blockquote: { block: 'blockquote' },
  paragraph: { block: 'paragraph' },
  em: { mark: 'em' },
  strong: { mark: 'strong' },
  link: {
    mark: 'link',
    attrs: (tok: any) => ({
      href: tok.attrGet('href'),
      title: tok.attrGet('title') || null,
    }),
  },
  hr: { node: 'rule' },
  heading: {
    block: 'heading',
    attrs: (tok: any) => ({ level: +tok.tag.slice(1) }),
  },
  softbreak: { node: 'hardBreak' },
  hardbreak: { node: 'hardBreak' },
  code_block: { block: 'codeBlock' },
  list_item: { block: 'listItem' },
  bullet_list: { block: 'bulletList' },
  ordered_list: {
    block: 'orderedList',
    attrs: (tok: any) => ({ order: +tok.attrGet('order') || 1 }),
  },
  code_inline: { mark: 'code' },
  fence: {
    block: 'codeBlock',
    attrs: (tok: any) => ({ language: tok.info || null }),
  },
  media_single: {
    block: 'mediaSingle',
    attrs: (tok: any) => {
      return {};
    },
  },
  media: {
    node: 'media',
    attrs: (tok: any) => {
      return {
        url: tok.attrGet('url'),
        type: 'external',
      };
    },
  },
  emoji: {
    node: 'emoji',
    attrs: (tok: any) => ({
      shortName: `:${tok.markup}:`,
      text: tok.content,
    }),
  },
  table: { block: 'table' },
  tr: { block: 'tableRow' },
  th: { block: 'tableHeader' },
  td: { block: 'tableCell' },
  s: { mark: 'strike' },
};

const md = MarkdownIt('zero', {
  html: false,
  linkify: true,
});

md.enable([
  // Process html entity - &#123;, &#xAF;, &quot;, ...
  'entity',
  // Process escaped chars and hardbreaks
  'escape',
]);

export type Markdown = string;

export class MarkdownTransformer implements Transformer<Markdown> {
  private markdownParser: MarkdownParser;
  constructor(schema: Schema = defaultSchema, tokenizer: MarkdownIt = md) {
    // Enable markdown plugins based on schema
    ['nodes', 'marks'].forEach(key => {
      for (const idx in pmSchemaToMdMapping[key]) {
        if (schema[key][idx]) {
          tokenizer.enable(pmSchemaToMdMapping[key][idx]);
        }
      }
    });

    if (schema.nodes.table) {
      tokenizer.use(markdownItTable);
    }

    if (schema.nodes.media && schema.nodes.mediaSingle) {
      tokenizer.use(markdownItMedia);
    }

    this.markdownParser = new MarkdownParser(
      schema,
      tokenizer,
      filterMdToPmSchemaMapping(schema, mdToPmMapping),
    );
  }
  encode(node: PMNode): Markdown {
    throw new Error('This is not implemented yet');
  }

  parse(content: Markdown): PMNode {
    return this.markdownParser.parse(content);
  }
}
