import * as MarkdownIt from 'markdown-it';
// @ts-ignore
import { handlePaste as handlePasteTable } from 'prosemirror-tables';
import { Schema, Slice, Node, Fragment } from 'prosemirror-model';
import { Plugin, PluginKey, TextSelection, Selection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { closeHistory } from 'prosemirror-history';
import { hasParentNodeOfType } from 'prosemirror-utils';
import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer';
import { analyticsService } from '../../../analytics';
import * as clipboard from '../../../utils/clipboard';
import { EditorAppearance } from '../../../types';
import { insertMediaAsMediaSingle } from '../../media/utils/media-single';
import linkify from '../linkify-md-plugin';
import { escapeLinks, isPastedFromWord, getPasteSource } from '../util';
import { transformSliceToRemoveOpenBodiedExtension } from '../../extension/actions';
import { transformSliceToRemoveOpenLayoutNodes } from '../../layout/utils';
import { linkifyContent } from '../../hyperlink/utils';
import { pluginKey as tableStateKey } from '../../table/pm-plugins/main';
import {
  transformSliceToRemoveOpenTable,
  transformSliceToRemoveNumberColumn,
} from '../../table/utils';
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
import { queueCardsFromChangedTr } from '../../card/pm-plugins/doc';

export const stateKey = new PluginKey('pastePlugin');

export function createPlugin(
  schema: Schema,
  editorAppearance?: EditorAppearance,
) {
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

  const atlassianMarkDownParser = new MarkdownTransformer(schema, md);

  return new Plugin({
    key: stateKey,
    props: {
      handleDOMEvents: {
        paste(view: EditorView, event: ClipboardEvent) {
          // @see https://product-fabric.atlassian.net/browse/ED-5366
          if (clipboard.isPastedFile(event)) {
            const html = event.clipboardData.getData('text/html');
            event.preventDefault();

            // Microsoft Office always copies an image to clipboard so we don't let the event reach media
            if (isPastedFromWord(html)) {
              event.stopPropagation();
            }
            return true;
          }
          return false;
        },
      },
      handlePaste(view: EditorView, event: ClipboardEvent, slice: Slice) {
        if (!event.clipboardData) {
          return false;
        }

        const text = event.clipboardData.getData('text/plain');
        const html = event.clipboardData.getData('text/html');

        const { state, dispatch } = view;
        const { codeBlock, media, decisionItem, taskItem } = state.schema.nodes;

        if (handlePasteAsPlainText(slice, event)(state, dispatch, view)) {
          return true;
        }

        // send analytics
        if (hasParentNodeOfType([decisionItem, taskItem])(state.selection)) {
          analyticsService.trackEvent(
            'atlassian.fabric.action-decision.editor.paste',
          );
        } else {
          analyticsService.trackEvent('atlassian.editor.paste', {
            source: getPasteSource(event),
          });
        }
        let markdownSlice: Slice | undefined;
        if (text && !html) {
          const doc = atlassianMarkDownParser.parse(escapeLinks(text));
          if (doc && doc.content) {
            markdownSlice = new Slice(
              doc.content,
              slice.openStart,
              slice.openEnd,
            );
          }

          // run macro autoconvert prior to other conversions
          if (
            markdownSlice &&
            handleMacroAutoConvert(text, markdownSlice)(state, dispatch, view)
          ) {
            return true;
          }
        }

        if (handlePasteIntoTaskAndDecision(slice)(state, dispatch)) {
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
        if (text && !html && markdownSlice) {
          analyticsService.trackEvent('atlassian.editor.paste.markdown');
          const tr = closeHistory(state.tr);
          tr.replaceSelection(markdownSlice);

          queueCardsFromChangedTr(state, tr);
          dispatch(tr.scrollIntoView());
          return true;
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
          if (handlePasteTable(view, null, slice)) {
            return true;
          }

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

          // queue link cards, ignoring any errors
          dispatch(queueCardsFromChangedTr(state, tr));
          return true;
        }

        return false;
      },
      transformPasted(slice) {
        // remove table number column if its part of the node
        slice = transformSliceToRemoveNumberColumn(slice, schema);

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
