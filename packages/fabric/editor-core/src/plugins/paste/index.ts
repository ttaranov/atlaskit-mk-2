import { keymap } from 'prosemirror-keymap';
import { MarkdownParser } from 'prosemirror-markdown';
import { Schema, Slice } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import * as MarkdownIt from 'markdown-it';
import table from 'markdown-it-table';
import { stateKey as tableStateKey } from '../table';
import { containsTable } from '../table/utils';
import { isSingleLine, isCode, filterMdToPmSchemaMapping } from './util';
import { analyticsService } from '../../analytics';
import * as keymaps from '../../keymaps';

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
  }
};

const mdToPmMapping = {
  blockquote: { block: 'blockquote' },
  paragraph: { block: 'paragraph' },
  em: { mark: 'em' },
  strong: { mark: 'strong' },
  link: {
    mark: 'link', attrs: tok => ({
      href: tok.attrGet('href'),
      title: tok.attrGet('title') || null
    })
  },
  hr: { node: 'rule' },
  heading: { block: 'heading', attrs: tok => ({ level: +tok.tag.slice(1) }) },
  code_block: { block: 'codeBlock' },
  list_item: { block: 'listItem' },
  bullet_list: { block: 'bulletList' },
  ordered_list: { block: 'orderedList', attrs: tok => ({ order: +tok.attrGet('order') || 1 }) },
  code_inline: { mark: 'code' },
  fence: { block: 'codeBlock', attrs: tok => ({ language: tok.info || '' }) },
  image: {
    node: 'image', attrs: tok => ({
      src: tok.attrGet('src'),
      title: tok.attrGet('title') || null,
      alt: tok.children[0] && tok.children[0].content || null,
    })
  },
  emoji: {
    node: 'emoji', attrs: tok => ({
      shortName: `:${tok.markup}:`,
      text: tok.content,
    })
  },
  table: { block: 'table' },
  tr: { block: 'tableRow' },
  th: { block: 'tableHeader' },
  td: { block: 'tableCell' },
  s: { mark: 'strike' },
};

export const stateKey = new PluginKey('pastePlugin');

export function createPlugin(schema: Schema) {
  let atlassianMarkDownParser: MarkdownParser;

  const md = MarkdownIt('zero', { html: false, linkify: true });
  md.enable([
    // Process html entity - &#123;, &#xAF;, &quot;, ...
    'entity',
    // Process escaped chars and hardbreaks
    'escape'
  ]);

  // Enable markdown plugins based on schema
  ['nodes', 'marks'].forEach(key => {
    for (const idx in pmSchemaToMdMapping[key]) {
      if (schema[key][idx]) {
        md.enable(pmSchemaToMdMapping[key][idx]);
      }
    }
  });

  if (schema.nodes.table) {
    md.use(table);
  }

  atlassianMarkDownParser = new MarkdownParser(schema, md, filterMdToPmSchemaMapping(schema, mdToPmMapping));

  return new Plugin({
    key: stateKey,
    props: {
      handlePaste(view: EditorView, event: ClipboardEvent, slice: Slice) {
        if (!event.clipboardData) {
          return false;
        }

        // Bail if copied content has files
        if (event.clipboardData.types.indexOf('Files') > -1) {
          return true;
        }

        const { $from } = view.state.selection;

        // In case of SHIFT+CMD+V ("Paste and Match Style") we don't want to run the usual
        // fuzzy matching of content. ProseMirror already handles this scenario and will
        // provide us with slice containing paragraphs with plain text, which we decorate
        // with "stored marks".
        // @see prosemirror-view/src/clipboard.js:parseFromClipboard()).
        // @see prosemirror-view/src/input.js:doPaste().
        if ((view as any).shiftKey) { // <- using the same internal flag that prosemirror-view is using
          analyticsService.trackEvent('atlassian.editor.paste.alt');

          let tr = view.state.tr.replaceSelection(slice);
          const { storedMarks } = view.state;
          if (storedMarks && storedMarks.length) {
            storedMarks.forEach(mark => tr = tr.addMark($from.pos, $from.pos + slice.size, mark));
          }
          view.dispatch(tr.scrollIntoView());

          return true;
        }

        const text = event.clipboardData.getData('text/plain');
        const html = event.clipboardData.getData('text/html');
        const node = slice.content.firstChild;
        const { schema } = view.state;
        const selectedNode = $from.node($from.depth);

        // If we're in a code block, append the text contents of clipboard inside it
        if (text && selectedNode.type === schema.nodes.codeBlock) {
          view.dispatch(view.state.tr.insertText(text));
          return true;
        }

        // If the clipboard contents looks like computer code, create a code block
        if (
          (text && isCode(text)) ||
          (text && html && node && node.type === schema.nodes.codeBlock)
        ) {
          analyticsService.trackEvent('atlassian.editor.paste.code');
          let tr;
          if (isSingleLine(text)) {
            tr = view.state.tr.insertText(text);
            tr = tr.addMark($from.pos, $from.pos + text.length, schema.marks.code.create());
          } else {
            const codeBlockNode = schema.nodes.codeBlock.create(node ? node.attrs : {}, schema.text(text));
            tr = view.state.tr.replaceSelectionWith(codeBlockNode);
          }
          view.dispatch(tr.scrollIntoView());
          return true;
        }

        // If the clipboard only contains plain text, attempt to parse it as Markdown
        if (text && !html && atlassianMarkDownParser) {
          analyticsService.trackEvent('atlassian.editor.paste.markdown');
          const doc = (atlassianMarkDownParser as any).parse(text);
          if (doc && doc.content) {
            const tr = view.state.tr.replaceSelection(
              new Slice(doc.content, slice.openStart, slice.openEnd)
            );
            view.dispatch(tr.scrollIntoView());
            return true;
          }
        }

        // If the clipboard contains rich text, pass it through the schema and import what's allowed.
        if (html) {
          const tableState = tableStateKey.getState(view.state);
          if (tableState && tableState.isRequiredToAddHeader() && containsTable(view, slice)) {
            const { state, dispatch } = view;
            const selectionStart = state.selection.$from.pos;
            dispatch(state.tr.replaceSelection(slice));
            tableState.addHeaderToTableNodes(slice, selectionStart);
            return true;
          }
        }

        return false;
      },
    }
  });
}

export function createKeymapPlugin(schema: Schema): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(keymaps.paste.common!, (state: EditorState, dispatch) => {
    analyticsService.trackEvent('atlassian.editor.paste');

    return false;
  }, list);

  keymaps.bindKeymapWithCommand(keymaps.altPaste.common!, (state: EditorState, dispatch) => {
    analyticsService.trackEvent('atlassian.editor.paste');

    return false;
  }, list);

  return keymap(list);
}

export default (schema: Schema) => [
  createPlugin(schema), createKeymapPlugin(schema)
];
