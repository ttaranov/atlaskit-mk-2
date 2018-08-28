import {
  createEditor,
  doc,
  p,
  blockquote,
  media,
  mediaSingle,
  code_block,
  sendKeyToPm,
  storyMediaProviderFactory,
  randomId,
} from '@atlaskit/editor-test-helpers';
import { ProviderFactory } from '@atlaskit/editor-common';

import { DefaultMediaStateManager } from '../../../../plugins/media';
import mediaPlugin from '../../../../plugins/media';
import codeBlockPlugin from '../../../../plugins/code-block';

const testCollectionName = `media-plugin-mock-collection-${randomId()}`;

describe('mediaSingle - keymap', () => {
  const providerFactory = new ProviderFactory();

  const editor = (doc: any, uploadErrorHandler?: () => void) => {
    const stateManager = new DefaultMediaStateManager();
    const mediaProvider = storyMediaProviderFactory({
      collectionName: testCollectionName,
      stateManager,
      includeUserAuthProvider: true,
    });

    return createEditor({
      doc,
      editorPlugins: [
        mediaPlugin({ provider: mediaProvider, allowMediaSingle: true }),
        codeBlockPlugin(),
      ],
    });
  };

  afterEach(() => {
    providerFactory.destroy();
  });

  const tempMediaNode = media({
    id: '12345',
    collection: 'test-collection',
    type: 'file',
    height: 100,
    width: 200,
  })();

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
