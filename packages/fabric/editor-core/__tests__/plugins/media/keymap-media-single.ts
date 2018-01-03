import {
  defaultSchema,
  makeEditor,
  doc,
  p,
  blockquote,
  media,
  mediaSingle,
  code_block,
  sendKeyToPm,
} from '@atlaskit/editor-test-helpers';
import {
  MediaPluginState,
  mediaPluginFactory,
  ProviderFactory,
} from '../../../src';
import { keymapPlugin } from '../../../src/plugins/media/keymap-media-single';

describe('mediaSingle - keymap', () => {
  const providerFactory = new ProviderFactory();

  const editor = (doc: any, uploadErrorHandler?: () => void) =>
    makeEditor<MediaPluginState>({
      doc,
      plugins: [
        ...mediaPluginFactory(defaultSchema, {
          providerFactory,
          uploadErrorHandler,
        }),
        keymapPlugin(defaultSchema),
      ],
      schema: defaultSchema,
    });

  afterEach(() => {
    providerFactory.destroy();
  });

  const tempMediaNode = media({
    id: '12345',
    collection: 'test-collection',
    type: 'file',
    height: 100,
    width: 200,
  });

  it('should remove the empty paragraph on backspace', () => {
    const { editorView } = editor(
      doc(
        p(''),
        mediaSingle({ layout: 'wrap-right' })(tempMediaNode),
        p('{<>}Hello World!'),
      ),
    );

    sendKeyToPm(editorView, 'Backspace');

    expect(editorView.state.doc).toEqualDocument(
      doc(
        mediaSingle({ layout: 'wrap-right' })(tempMediaNode),
        p('Hello World!'),
      ),
    );

    editorView.destroy();
  });

  it('should remove the empty blockquote on backspace', () => {
    const { editorView } = editor(
      doc(
        blockquote(p('')),
        mediaSingle({ layout: 'wrap-right' })(tempMediaNode),
        p('{<>}Hello World!'),
      ),
    );

    sendKeyToPm(editorView, 'Backspace');

    expect(editorView.state.doc).toEqualDocument(
      doc(
        mediaSingle({ layout: 'wrap-right' })(tempMediaNode),
        p('Hello World!'),
      ),
    );

    editorView.destroy();
  });

  it('should remove the empty codeBlock on backspace', () => {
    const { editorView } = editor(
      doc(
        code_block({})(''),
        mediaSingle({ layout: 'wrap-right' })(tempMediaNode),
        p('{<>}Hello World!'),
      ),
    );

    sendKeyToPm(editorView, 'Backspace');

    expect(editorView.state.doc).toEqualDocument(
      doc(
        mediaSingle({ layout: 'wrap-right' })(tempMediaNode),
        p('Hello World!'),
      ),
    );

    editorView.destroy();
  });

  it('should not remove anything on backspace if the paragraph before is not empty', () => {
    const { editorView } = editor(
      doc(
        p('Hey!'),
        mediaSingle({ layout: 'wrap-right' })(tempMediaNode),
        p('{<>}Hello World!'),
      ),
    );

    sendKeyToPm(editorView, 'Backspace');

    expect(editorView.state.doc).toEqualDocument(
      doc(
        p('Hey!'),
        mediaSingle({ layout: 'wrap-right' })(tempMediaNode),
        p('Hello World!'),
      ),
    );

    editorView.destroy();
  });

  it('should not remove the first empty paragraph on backspace if the selection is not empty', () => {
    const { editorView } = editor(
      doc(
        p(''),
        mediaSingle({ layout: 'wrap-right' })(tempMediaNode),
        p('{<}Hello World!{>}'),
      ),
    );

    sendKeyToPm(editorView, 'Backspace');

    expect(editorView.state.doc).toEqualDocument(
      doc(p(''), mediaSingle({ layout: 'wrap-right' })(tempMediaNode), p('')),
    );

    editorView.destroy();
  });

  it('should not remove the first empty paragraph on backspace if mediaSingle is not wrap-right', () => {
    const { editorView } = editor(
      doc(
        p(''),
        mediaSingle({ layout: 'center' })(tempMediaNode),
        p('{<>}Hello World!'),
      ),
    );

    sendKeyToPm(editorView, 'Backspace');

    expect(editorView.state.doc).toEqualDocument(
      doc(
        p(''),
        mediaSingle({ layout: 'center' })(tempMediaNode),
        p('Hello World!'),
      ),
    );

    editorView.destroy();
  });
});
