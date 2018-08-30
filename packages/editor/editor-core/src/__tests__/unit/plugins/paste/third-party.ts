import appleTextHTML from './__third-party__/apple-pages/text/html';
import appleTextPlain from './__third-party__/apple-pages/text/plain';
import confluenceTextHTML from './__third-party__/atlassian-confluence/text/html';
import confluenceTextPlain from './__third-party__/atlassian-confluence/text/plain';
import dropboxTextHTML from './__third-party__/dropbox-paper/text/html';
import dropboxTextPlain from './__third-party__/dropbox-paper/text/plain';
import googleTextHTML from './__third-party__/google-docs/text/html';
import googleTextPlain from './__third-party__/google-docs/text/plain';
import msWordTextHTML from './__third-party__/microsoft-word/text/html';
import msWordTextPlain from './__third-party__/microsoft-word/text/plain';
import { toJSON } from '../../../../utils';
import {
  createEditor,
  doc,
  p,
  dispatchPasteEvent,
} from '@atlaskit/editor-test-helpers';
import { smallImage } from '@atlaskit/media-test-helpers';
import { dataURItoBlob } from '../../../../../../../media/media-test-helpers/src/mockData/utils';

describe('paste plugin: third-party', () => {
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: {
        allowCodeBlocks: true,
        allowLists: true,
        allowTextColor: true,
        allowTables: true,
      },
    });
  it('should handle pasting content from Apple Pages', () => {
    const { editorView } = editor(doc(p('')));
    dispatchPasteEvent(editorView, {
      html: appleTextHTML,
      plain: appleTextPlain,
    });
    expect(toJSON(editorView.state.doc)).toMatchDocSnapshot();
  });

  it('should handle pasting content from Confluence', () => {
    const { editorView } = editor(doc(p('')));
    dispatchPasteEvent(editorView, {
      html: confluenceTextHTML,
      plain: confluenceTextPlain,
    });
    expect(toJSON(editorView.state.doc)).toMatchDocSnapshot();
  });

  it('should handle pasting content from Dropbox Paper', () => {
    const { editorView } = editor(doc(p('')));
    dispatchPasteEvent(editorView, {
      html: dropboxTextHTML,
      plain: dropboxTextPlain,
    });
    expect(toJSON(editorView.state.doc)).toMatchDocSnapshot();
  });

  it('should handle pasting content from Google Docs', () => {
    const { editorView } = editor(doc(p('')));
    dispatchPasteEvent(editorView, {
      html: googleTextHTML,
      plain: googleTextPlain,
    });
    expect(toJSON(editorView.state.doc)).toMatchDocSnapshot();
  });

  it('should handle pasting content from Microsoft Word', () => {
    const { editorView } = editor(doc(p('')));
    dispatchPasteEvent(editorView, {
      html: msWordTextHTML,
      plain: msWordTextPlain,
    });
    expect(toJSON(editorView.state.doc)).toMatchDocSnapshot();
  });

  it('should ignore image on clipboard when pasting content from Microsoft Word', () => {
    const { editorView } = editor(doc(p('')));
    const blob = dataURItoBlob(smallImage);
    const image = new File([blob], 'image.png', { type: 'image/png' });

    const event = dispatchPasteEvent(editorView, {
      html: msWordTextHTML,
      plain: msWordTextPlain,
      files: [image],
      types: ['Files', 'text/plain', 'text/html'],
    }) as CustomEvent;

    expect(event.cancelBubble).toBe(true);
  });
});
