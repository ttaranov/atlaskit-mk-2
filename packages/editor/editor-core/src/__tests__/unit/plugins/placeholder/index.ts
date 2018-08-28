import {
  doc,
  insertText,
  createEditor,
  p,
  sleep,
} from '@atlaskit/editor-test-helpers';
import { EditorView } from 'prosemirror-view';
import { TestingEditorView } from '../../../../../../editor-test-helpers/src/types/prosemirror';

interface InputEvent extends UIEvent, Event {
  data: string;
  dataTransfer: DataTransfer;
  inputType: string;
  readonly isComposing: boolean;
}

describe('placeholder', () => {
  const editor = (doc: any, trackEvent = () => {}) =>
    createEditor({
      doc,
      editorPlugins: [],
      editorProps: {
        placeholder: 'potato',
        analyticsHandler: trackEvent,
      },
    });

  const androidComposeStart = function(view: EditorView, data: string) {
    view.dom.dispatchEvent(
      new CustomEvent('keydown', {
        charCode: 0,
        keyCode: 229,
        which: 229,
        view: window,
      } as any),
    );

    view.dom.dispatchEvent(
      new CustomEvent('compositionstart', {
        data: '',
        view: window,
      } as CompositionEvent),
    );

    view.dom.dispatchEvent(
      new CustomEvent('beforeinput', {
        data,
        isComposing: true,
        inputType: 'insertCompositionText',
        view: window,
      } as InputEvent),
    );

    view.dom.dispatchEvent(
      new CustomEvent('compositionupdate', {
        data,
        view: window,
      } as CompositionEvent),
    );

    view.dom.dispatchEvent(
      new CustomEvent('input', {
        data,
        isComposing: true,
        inputType: 'insertCompositionText',
        view: window,
      } as InputEvent),
    );

    view.dom.dispatchEvent(
      new CustomEvent('keyup', {
        charCode: 0,
        keyCode: 229,
        which: 229,
        altKey: false,
        view: window,
        isComposing: true,
      } as any),
    );
  };

  // data is cumulative
  const androidComposeContinue = function(view: EditorView, data: string) {
    (view as TestingEditorView).dispatchEvent(
      new CustomEvent('keydown', {
        charCode: 0,
        keyCode: 229,
        which: 229,
        view: window,
        isComposing: true,
      } as any),
    );

    view.dom.dispatchEvent(
      new CustomEvent('beforeinput', {
        data,
        isComposing: true,
        inputType: 'insertCompositionText',
        view: window,
      } as InputEvent),
    );

    view.dom.dispatchEvent(
      new CustomEvent('compositionupdate', {
        data,
        view: window,
      } as CompositionEvent),
    );

    view.dom.dispatchEvent(
      new CustomEvent('input', {
        data,
        isComposing: true,
        inputType: 'insertCompositionText',
        view: window,
      } as InputEvent),
    );

    // by this point, the DOM should now be synced with 'data'

    view.dom.dispatchEvent(
      new CustomEvent('keyup', {
        charCode: 0,
        keyCode: 229,
        which: 229,
        view: window,
        isComposing: true,
      } as any),
    );
  };

  const androidComposeEnd = function(view: EditorView, data: string) {
    view.dom.dispatchEvent(
      new CustomEvent('compositionend', {
        data,
        view: window,
      } as CompositionEvent),
    );
  };

  it('renders a placeholder on a blank document', () => {
    const { editorView } = editor(doc(p()));
    expect(editorView.dom.innerHTML).toEqual(
      '<p><span class="placeholder-decoration ProseMirror-widget" data-text="potato"></span><br></p>',
    );
  });

  it('disappears when content is added to document', () => {
    const { editorView } = editor(doc(p()));
    expect(editorView.dom.innerHTML).toEqual(
      '<p><span class="placeholder-decoration ProseMirror-widget" data-text="potato"></span><br></p>',
    );

    insertText(editorView, 'a', 0);
    expect(editorView.dom.innerHTML).toEqual('<p>a</p><p><br></p>');
  });

  describe('on mobile', () => {
    it('disappears when a compositionstart event occurs', () => {
      const { editorView } = editor(doc(p()));
      expect(editorView.dom.innerHTML).toEqual(
        '<p><span class="placeholder-decoration ProseMirror-widget" data-text="potato"></span><br></p>',
      );

      editorView.dom.dispatchEvent(
        new KeyboardEvent('compositionstart', { key: 'a' }),
      );
      expect(editorView.dom.innerHTML).toEqual('<p><br></p>');
    });

    /*
     * ProseMirror currently doesn't keep track of the contents of the composition events,
     * and only looks at the state of the DOM after a compositionend to determine how to update the document state.
     * 
     * As such, we manually update the DOM with typed text.
     * 
     * However, ProseMirror's behaviour may (change in the future)[https://github.com/ProseMirror/prosemirror/issues/543].
     */

    it('stays hidden and keeps content after a full composition completes', async () => {
      const { editorView } = editor(doc(p()));
      expect(editorView.dom.innerHTML).toEqual(
        '<p><span class="placeholder-decoration ProseMirror-widget" data-text="potato"></span><br></p>',
      );

      androidComposeStart(editorView, 'a');
      expect(editorView.dom.innerHTML).toEqual('<p><br></p>');

      androidComposeContinue(editorView, 'ab');

      // update the DOM with the actual typed text
      editorView.dom.children[0].innerHTML = 'ab';

      androidComposeEnd(editorView, 'ab');

      // ProseMirror does DOM sync after compositionend after 50ms
      await sleep(50);

      expect(editorView.dom.innerHTML).toEqual('<p>ab</p>');
      expect(editorView.state.doc).toEqualDocument(doc(p('ab')));
    });

    it('reappears after text is backspaced', async () => {
      const { editorView } = editor(doc(p()));
      expect(editorView.dom.innerHTML).toEqual(
        '<p><span class="placeholder-decoration ProseMirror-widget" data-text="potato"></span><br></p>',
      );

      androidComposeStart(editorView, 'a');
      expect(editorView.dom.innerHTML).toEqual('<p><br></p>');

      // update the DOM with the actual typed text
      androidComposeContinue(editorView, 'ab');
      editorView.dom.children[0].innerHTML = 'ab';

      androidComposeContinue(editorView, 'a');
      editorView.dom.children[0].innerHTML = 'a';

      androidComposeContinue(editorView, '');
      editorView.dom.children[0].innerHTML = '';

      androidComposeEnd(editorView, '');

      // ProseMirror does DOM sync after compositionend after 50ms
      await sleep(50);

      expect(editorView.dom.innerHTML).toEqual(
        '<p><span class="placeholder-decoration ProseMirror-widget" data-text="potato"></span><br></p>',
      );
      expect(editorView.state.doc).toEqualDocument(doc(p()));
    });
  });
});
