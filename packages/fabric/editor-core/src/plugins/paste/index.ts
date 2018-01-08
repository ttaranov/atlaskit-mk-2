import { keymap } from 'prosemirror-keymap';
import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer';
import { Schema, Slice } from 'prosemirror-model';
import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import * as MarkdownIt from 'markdown-it';
import { stateKey as tableStateKey } from '../table';
import { containsTable } from '../../editor/plugins/table/utils';
import { insertMediaAsMediaSingle } from '../media/media-single';
import { isSingleLine, isCode, escapeLinks } from './util';
import { analyticsService } from '../../analytics';
import * as keymaps from '../../keymaps';
import { EditorAppearance } from '../../editor/index';
import linkify from './linkify-md-plugin';
import * as clipboard from '../../utils/clipboard';

export const stateKey = new PluginKey('pastePlugin');

export function createPlugin(
  schema: Schema,
  editorAppearance?: EditorAppearance,
) {
  let atlassianMarkDownParser: MarkdownTransformer;

  const md = MarkdownIt('zero', { html: false });
  md.enable([
    // Process html entity - &#123;, &#xAF;, &quot;, ...
    'entity',
    // Process escaped chars and hardbreaks
    'escape',
  ]);

  // enable modified version of linkify plugin
  // @see https://product-fabric.atlassian.net/browse/ED-3097
  md.use(linkify);

  atlassianMarkDownParser = new MarkdownTransformer(schema, md);

  return new Plugin({
    key: stateKey,
    props: {
      handlePaste(view: EditorView, event: ClipboardEvent, slice: Slice) {
        if (!event.clipboardData) {
          return false;
        }

        // Bail if copied content has files
        if (clipboard.isPastedFile(event)) {
          return true;
        }

        const { $from } = view.state.selection;

        // In case of SHIFT+CMD+V ("Paste and Match Style") we don't want to run the usual
        // fuzzy matching of content. ProseMirror already handles this scenario and will
        // provide us with slice containing paragraphs with plain text, which we decorate
        // with "stored marks".
        // @see prosemirror-view/src/clipboard.js:parseFromClipboard()).
        // @see prosemirror-view/src/input.js:doPaste().
        if ((view as any).shiftKey) {
          // <- using the same internal flag that prosemirror-view is using
          analyticsService.trackEvent('atlassian.editor.paste.alt');

          let tr = view.state.tr.replaceSelection(slice);
          const { storedMarks } = view.state;
          if (storedMarks && storedMarks.length) {
            storedMarks.forEach(
              mark =>
                (tr = tr.addMark($from.pos, $from.pos + slice.size, mark)),
            );
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

        if (
          editorAppearance !== 'message' &&
          node &&
          node.type === schema.nodes.media
        ) {
          return insertMediaAsMediaSingle(view, node);
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
            tr = tr.addMark(
              $from.pos,
              $from.pos + text.length,
              schema.marks.code.create(),
            );
          } else {
            const codeBlockNode = schema.nodes.codeBlock.create(
              node ? node.attrs : {},
              schema.text(text),
            );
            tr = view.state.tr.replaceSelectionWith(codeBlockNode);
          }
          view.dispatch(tr.scrollIntoView());
          return true;
        }

        // If the clipboard only contains plain text, attempt to parse it as Markdown
        if (text && !html && atlassianMarkDownParser) {
          analyticsService.trackEvent('atlassian.editor.paste.markdown');
          const doc = atlassianMarkDownParser.parse(escapeLinks(text));
          if (doc && doc.content) {
            const tr = view.state.tr.replaceSelection(
              new Slice(doc.content, slice.openStart, slice.openEnd),
            );
            view.dispatch(tr.scrollIntoView());
            return true;
          }
        }

        // If the clipboard contains rich text, pass it through the schema and import what's allowed.
        if (html) {
          const tableState = tableStateKey.getState(view.state);
          if (
            tableState &&
            tableState.isRequiredToAddHeader() &&
            containsTable(view.state, slice)
          ) {
            const { state, dispatch } = view;
            const selectionStart = state.selection.$from.pos;
            dispatch(state.tr.replaceSelection(slice));
            tableState.addHeaderToTableNodes(slice, selectionStart);
            return true;
          }
        }

        return false;
      },
    },
  });
}

export function createKeymapPlugin(schema: Schema): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.paste.common!,
    (state: EditorState, dispatch) => {
      analyticsService.trackEvent('atlassian.editor.paste');

      return false;
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.altPaste.common!,
    (state: EditorState, dispatch) => {
      analyticsService.trackEvent('atlassian.editor.paste');

      return false;
    },
    list,
  );

  return keymap(list);
}

export default (schema: Schema, editorAppearance?: EditorAppearance) => [
  createPlugin(schema, editorAppearance),
  createKeymapPlugin(schema),
];
