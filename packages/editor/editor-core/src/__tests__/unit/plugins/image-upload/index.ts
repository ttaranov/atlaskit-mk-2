import { stateKey as imageUploadPluginKey } from '../../../../plugins/image-upload/pm-plugins/main';
import { ProviderFactory } from '@atlaskit/editor-common';
import {
  createEditor,
  doc,
  media,
  mediaSingle,
  p,
  code_block,
  createEvent,
  dispatchPasteEvent,
} from '@atlaskit/editor-test-helpers';
import { setNodeSelection, setTextSelection } from '../../../../utils';
import imageUpload from '../../../../plugins/image-upload';
import codeBlockPlugin from '../../../../plugins/code-block';
import mediaPlugin from '../../../../plugins/media';

describe('image-upload', () => {
  const testImgSrc =
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
  const testImg = () =>
    mediaSingle()(media({ type: 'external', url: testImgSrc })());
  const editor = (doc: any, imageUploadProvider?: any) =>
    createEditor({
      doc,
      editorPlugins: [
        imageUpload,
        codeBlockPlugin(),
        mediaPlugin({ allowMediaSingle: true }),
      ],
      providerFactory: ProviderFactory.create({ imageUploadProvider }),
      pluginKey: imageUploadPluginKey,
    });

  it('allows change handler to be registered', () => {
    const { pluginState } = editor(doc(p('')));

    pluginState.subscribe(jest.fn());
  });

  it('allows an image to be added at the current collapsed selection', () => {
    const { editorView, pluginState } = editor(doc(p('{<>}')));

    pluginState.addImage(editorView)({ src: testImgSrc });

    expect(editorView.state.doc).toEqualDocument(doc(testImg()));
  });

  it('should get current state immediately once subscribed', () => {
    const { pluginState } = editor(doc(p('{<}'), testImg(), p('{>}')));
    const spy = jest.fn();
    pluginState.subscribe(spy);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(pluginState).toHaveProperty('active', false);
    expect(pluginState).toHaveProperty('enabled', true);
    expect(pluginState).toHaveProperty('src', undefined);
    expect(pluginState).toHaveProperty('element', undefined);
  });

  it('emits a change when an image is selected', () => {
    const { editorView, pluginState, sel } = editor(doc(p('{<>}'), testImg()));
    const spy = jest.fn();
    pluginState.subscribe(spy);

    setNodeSelection(editorView, sel + 2);

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('does not emits a change when unsubscribe', () => {
    const { editorView, pluginState, sel } = editor(doc(p('{<>}'), testImg()));
    const spy = jest.fn();
    pluginState.subscribe(spy);
    pluginState.unsubscribe(spy);

    setNodeSelection(editorView, sel + 2);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does not emit multiple changes when an image is not selected', () => {
    const { editorView, pluginState, refs } = editor(
      doc(p('{<>}t{a}e{b}st'), testImg()),
    );
    const { a, b } = refs;
    const spy = jest.fn();
    pluginState.subscribe(spy);

    setTextSelection(editorView, a + 2);
    setTextSelection(editorView, b + 2);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does not emit multiple changes when an image is selected multiple times', () => {
    const { pluginState } = editor(doc(p('{<>}'), testImg()));
    const spy = jest.fn();

    pluginState.subscribe(spy);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('emits a change event when selection leaves an image', () => {
    const { editorView, pluginState, sel, refs } = editor(
      doc(p('{a}test{<>}'), testImg()),
    );
    const { a } = refs;
    const spy = jest.fn();
    setNodeSelection(editorView, sel + 2);
    pluginState.subscribe(spy);

    setTextSelection(editorView, a);

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('permits an image to be added when an image is selected', () => {
    const { editorView, pluginState, sel } = editor(doc(p('{<>}'), testImg()));
    setNodeSelection(editorView, sel + 2);

    pluginState.addImage(editorView)({ src: testImgSrc });

    expect(editorView.state.doc).toEqualDocument(
      doc(p(), testImg(), testImg()),
    );
  });

  it('permits an image to be added when there is selected text', () => {
    const { editorView, pluginState } = editor(doc(p('{<}hello{>}')));

    pluginState.addImage(editorView)({ src: testImgSrc });

    expect(editorView.state.doc).toEqualDocument(doc(p('hello'), testImg()));
  });

  it('inserts an image after the code block if selection is inside code block', () => {
    const { editorView, pluginState } = editor(doc(code_block()('{<>}')));

    pluginState.addImage(editorView)({ src: testImgSrc });

    expect(editorView.state.doc).toEqualDocument(
      doc(code_block()(), testImg()),
    );
  });

  it('should invoke upload handler after pasting an image', async () => {
    const imageUploadHandler = jest.fn();
    const imageUploadProvider = Promise.resolve(imageUploadHandler);
    const { editorView } = editor(doc(p('{<>}')), imageUploadProvider);

    // Wait for imageUploadProvider to resolve and be ready
    await imageUploadProvider;

    dispatchPasteEvent(editorView, { types: ['Files'] });
    expect(imageUploadHandler).toHaveBeenCalledTimes(1);
    expect(imageUploadHandler.mock.calls[0][0].clipboardData.types).toContain(
      'Files',
    );
  });

  it('should invoke upload handler after dropping an image', async () => {
    const imageUploadHandler = jest.fn();
    const imageUploadProvider = Promise.resolve(imageUploadHandler);
    const { editorView } = editor(doc(p('{<>}')), imageUploadProvider);

    // Wait for imageUploadProvider to resolve and be ready
    await imageUploadProvider;

    const event = createEvent('drop');
    Object.defineProperties(event, {
      dataTransfer: {
        value: {
          getData: (type: string) => '',
          setData: () => {},
          clearData: () => {},
          types: ['Files'],
          files: [],
          items: [],
        },
      },
    });

    editorView.dom.dispatchEvent(event);
    expect(imageUploadHandler).toHaveBeenCalledTimes(1);
    expect(imageUploadHandler.mock.calls[0][0].dataTransfer.types).toContain(
      'Files',
    );
  });
});
