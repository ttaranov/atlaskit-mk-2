import { browser } from '@atlaskit/editor-common';
import { EditorView } from 'prosemirror-view';
import { TestingEditorView } from './types/prosemirror';
import createEvent from './create-event';

export interface PasteContent {
  plain?: string;
  html?: string;
  types?: Array<string>;
  files?: Array<File>;
}

/**
 * Dispatch a paste event on the given ProseMirror instance
 *
 * Usage:
 *     dispatchPasteEvent(pm, {
 *         plain: 'copied text'
 *     });
 */
export default (
  editorView: EditorView,
  content: PasteContent,
): Event | false => {
  const event = createEvent('paste');

  const clipboardData = {
    getData(type: string) {
      if (type === 'text/plain') {
        return content.plain;
      }
      if (type === 'text/html') {
        return content.html;
      }
    },
    types: content.types || [],
    files: content.files || [],
  };

  // Skiping IE < 15
  // Reason: https://github.com/ProseMirror/prosemirror-view/blob/9d2295d03c2d17357213371e4d083f0213441a7e/src/input.js#L379-L384
  if ((browser.ie && browser.ie_version < 15) || browser.ios) {
    return false;
  }

  try {
    Object.defineProperty(event, 'clipboardData', { value: clipboardData });
  } catch (e) {
    // iOS 9 will throw if we assign `clipboardData` to `event`
    // revert this change once iOS 10 is out
    return false;
  }

  (editorView as TestingEditorView).dispatchEvent(event);
  return event;
};
