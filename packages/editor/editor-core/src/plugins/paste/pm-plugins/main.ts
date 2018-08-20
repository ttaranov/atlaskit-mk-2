import { keymap } from 'prosemirror-keymap';
import { Schema, Slice, Node, Fragment } from 'prosemirror-model';
import {
  EditorState,
  Plugin,
  PluginKey,
  TextSelection,
  Selection,
} from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import * as MarkdownIt from 'markdown-it';
import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer';
import { analyticsService } from '../../../analytics';
import * as keymaps from '../../../keymaps';
import * as clipboard from '../../../utils/clipboard';
import { EditorAppearance } from '../../../types';
import { insertMediaAsMediaSingle } from '../../media/utils/media-single';
import linkify from '../linkify-md-plugin';
import { escapeLinks, isPastedFromWord } from '../util';
import { transformSliceToRemoveOpenBodiedExtension } from '../../extension/actions';
import { transformSliceToRemoveOpenLayoutNodes } from '../../layout/utils';
import { linkifyContent } from '../../hyperlink/utils';
import { closeHistory } from 'prosemirror-history';
import { hasParentNodeOfType } from 'prosemirror-utils';
import { pluginKey as tableStateKey } from '../../table/pm-plugins/main';
import { transformSliceToRemoveOpenTable } from '../../table/utils';

// @ts-ignore
import { handlePaste as handlePasteTable } from 'prosemirror-tables';
import { transformSliceToAddTableHeaders } from '../../table/actions';
import {
  handlePasteIntoTaskAndDecision,
  handlePasteAsPlainText,
  handleMacroAutoConvert,
} from '../handlers';
import {
  transformSliceToJoinAdjacentCodeBlocks,
  transformSingleLineCodeBlockToCodeMark,
} from '../../code-block/utils';
import { queueCardFromTr } from '../../card/pm-plugins/actions';

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

    'newline',
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
          if (!isPastedFromWord(event)) {
            return true;
          }
          // Microsoft Office always copies an image to clipboard so we don't let the event reach media
          event.stopPropagation();
        }

        const { state, dispatch } = view;
        const { codeBlock, media } = state.schema.nodes;

        if (handlePasteIntoTaskAndDecision(slice)(state, dispatch)) {
          return true;
        }

        if (handlePasteAsPlainText(slice)(state, dispatch, view)) {
          return true;
        }

        const text = event.clipboardData.getData('text/plain');
        const html = event.clipboardData.getData('text/html');

        // runs macro autoconvert prior to other conversions
        if (text && !html && handleMacroAutoConvert(text)(state, dispatch)) {
          return true;
        }

        // If we're in a code block, append the text contents of clipboard inside it
        if (text && hasParentNodeOfType(codeBlock)(state.selection)) {
          const tr = closeHistory(state.tr);
          dispatch(tr.insertText(text));
          return true;
        }

        if (
          editorAppearance !== 'message' &&
          slice.content.childCount === 1 &&
          slice.content.firstChild!.type === media
        ) {
          return insertMediaAsMediaSingle(view, slice.content.firstChild!);
        }

        // If the clipboard only contains plain text, attempt to parse it as Markdown
        if (text && !html && atlassianMarkDownParser) {
          analyticsService.trackEvent('atlassian.editor.paste.markdown');
          const doc = atlassianMarkDownParser.parse(escapeLinks(text));

          if (doc && doc.content) {
            const tr = closeHistory(state.tr);
            const replacementSlice = new Slice(
              doc.content,
              slice.openStart,
              slice.openEnd,
            );

            // replace the selection
            tr.replaceSelection(replacementSlice);
            dispatch(tr.scrollIntoView());

            // queue cards, ignoring any errors
            Promise.all(queueCardFromTr(tr)(view)).catch(rejected => {});

            return true;
          }
        }

        // finally, handle rich-text copy-paste
        if (html) {
          // linkify the text where possible
          slice = linkifyContent(state.schema, slice);

          const { table, tableCell } = state.schema.nodes;

          // if we're pasting to outside a table or outside a table
          // header, ensure that we apply any table headers to the first
          // row of content we see, if required
          if (!hasParentNodeOfType([table, tableCell])(state.selection)) {
            const tableState = tableStateKey.getState(state);
            if (tableState && tableState.pluginConfig.isHeaderRowRequired) {
              slice = transformSliceToAddTableHeaders(slice, state.schema);
            }
          }

          // In case user is pasting inline code,
          // any backtick ` immediately preceding it should be removed.
          const tr = state.tr;
          if (
            slice.content.firstChild &&
            slice.content.firstChild.marks.some(
              m => m.type === state.schema.marks.code,
            )
          ) {
            const {
              $from: { nodeBefore },
              from,
            } = tr.selection;
            if (
              nodeBefore &&
              nodeBefore.isText &&
              nodeBefore.text!.endsWith('`')
            ) {
              tr.delete(from - 1, from);
            }
          }

          // get prosemirror-tables to handle pasting tables if it can
          // otherwise, just the replace the selection with the content
          if (!handlePasteTable(view, null, slice)) {
            closeHistory(tr);
            tr.replaceSelection(slice);
            tr.setStoredMarks([]);
            if (
              tr.selection.empty &&
              tr.selection.$from.parent.type === codeBlock
            ) {
              tr.setSelection(TextSelection.near(
                tr.selection.$from,
                1,
              ) as Selection);
            }

            dispatch(tr);
          }

          // queue link cards, ignoring any errors
          Promise.all(queueCardFromTr(tr)(view)).catch(rejected => {});
          return true;
        }

        return false;
      },
      transformPasted(slice) {
        /** If a partial paste of table, paste only table's content */
        slice = transformSliceToRemoveOpenTable(slice, schema);

        // We do this separately so it also applies to drag/drop events
        slice = transformSliceToRemoveOpenLayoutNodes(slice, schema);

        /** If a partial paste of bodied extension, paste only text */
        slice = transformSliceToRemoveOpenBodiedExtension(slice, schema);

        /* Bitbucket copies diffs as multiple adjacent code blocks
         * so we merge ALL adjacent code blocks to support paste here */
        slice = transformSliceToJoinAdjacentCodeBlocks(slice);

        slice = transformSingleLineCodeBlockToCodeMark(slice, schema);

        if (
          slice.content.childCount &&
          slice.content.lastChild!.type === schema.nodes.codeBlock
        ) {
          slice = new Slice(
            slice.content.append(
              Fragment.from(schema.nodes.paragraph.createAndFill() as Node),
            ),
            slice.openStart,
            1,
          );
        }
        return slice;
      },
      transformPastedHTML(html) {
        // Fix for issue ED-4438
        // text from google docs should not be pasted as inline code
        if (html.indexOf('id="docs-internal-guid-') >= 0) {
          html = html.replace(/white-space:pre/g, '');
          html = html.replace(/white-space:pre-wrap/g, '');
        }
        return html;
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
