import imageUploadPlugins, { ImageUploadState } from '../../../src/plugins/image-upload';
import {
  makeEditor, img, doc, p, code_block,
} from '@atlaskit/editor-test-helpers';
import { defaultSchema } from '@atlaskit/editor-test-helpers';
import { setNodeSelection, setTextSelection } from '../../../src/utils';


describe('image-upload', () => {
  const testImgSrc = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
  const testImg = () => img({ src: testImgSrc });
  const editor = (doc: any) => makeEditor<ImageUploadState>({
    doc,
    plugins: imageUploadPlugins(defaultSchema),
  });

  it('allows change handler to be registered', () => {
    const { pluginState } = editor(doc(p('')));

    pluginState.subscribe(jest.fn());
  });

  it('allows an image to be added at the current collapsed selection', () => {
    const { editorView, pluginState } = editor(doc(p('{<>}')));

    pluginState.addImage(editorView)({ src: testImgSrc });

    expect(editorView.state.doc).toEqualDocument(doc(p(testImg())));
  });

  it('should get current state immediately once subscribed', () => {
    const { pluginState } = editor(doc(p('{<>}', testImg())));
    const spy = jest.fn();
    pluginState.subscribe(spy);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(pluginState).toHaveProperty('active', false);
    expect(pluginState).toHaveProperty('enabled', true);
    expect(pluginState).toHaveProperty('src', undefined);
    expect(pluginState).toHaveProperty('element', undefined);
  });

  it('emits a change when an image is selected', () => {
    const { editorView, pluginState, sel } = editor(doc(p('{<>}', testImg())));
    const spy = jest.fn();
    pluginState.subscribe(spy);

    setNodeSelection(editorView, sel);

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('does not emits a change when unsubscribe', () => {
    const { editorView, pluginState, sel } = editor(doc(p('{<>}', testImg())));
    const spy = jest.fn();
    pluginState.subscribe(spy);
    pluginState.unsubscribe(spy);

    setNodeSelection(editorView, sel);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does not emit multiple changes when an image is not selected', () => {
    const { editorView, pluginState, refs } = editor(doc(p('{<>}t{a}e{b}st', testImg())));
    const { a, b } = refs;
    const spy = jest.fn();
    pluginState.subscribe(spy);

    setTextSelection(editorView, a);
    setTextSelection(editorView, b);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does not emit multiple changes when an image is selected multiple times', () => {
    const { pluginState } = editor(doc(p('{<>}', testImg())));
    const spy = jest.fn();

    pluginState.subscribe(spy);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('emits a change event when selection leaves an image', () => {
    const { editorView, pluginState, sel, refs } = editor(doc(p('{a}test{<>}', testImg())));
    const { a } = refs;
    const spy = jest.fn();
    setNodeSelection(editorView, sel);
    pluginState.subscribe(spy);

    setTextSelection(editorView, a);

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('permits an image to be added when an image is selected', () => {
    const { editorView, pluginState, sel } = editor(doc(p('{<>}', testImg())));
    setNodeSelection(editorView, sel);

    pluginState.addImage(editorView)({ src: testImgSrc });

    expect(editorView.state.doc).toEqualDocument(doc(p(testImg(), testImg())));
  });

  it('permits an image to be added when there is selected text', () => {
    const { editorView, pluginState } = editor(doc(p('{<}hello{>}')));

    pluginState.addImage(editorView)({ src: testImgSrc });

    expect(editorView.state.doc).toEqualDocument(doc(p('hello', testImg())));
  });

  it('does not permit an image to be added when the state is disabled', () => {
    const { editorView, pluginState } = editor(doc(code_block()('{<>}')));

    pluginState.addImage(editorView)({ src: testImgSrc });

    expect(editorView.state.doc).toEqualDocument(doc(code_block()()));
  });

  it('does not permit an image to be removed at a collapsed text selection', () => {
    const { editorView, pluginState } = editor(doc(p('test{<>}')));

    pluginState.removeImage(editorView);
  });

  it('can remove a selected image', () => {
    const { editorView, pluginState, sel } = editor(doc(p('{<>}', testImg())));
    setNodeSelection(editorView, sel);

    pluginState.removeImage(editorView);

    expect(editorView.state.doc).toEqualDocument(doc(p()));
  });

  it('can update a selected image', () => {
    const { editorView, pluginState, sel } = editor(doc(p('{<>}', testImg())));
    setNodeSelection(editorView, sel);

    pluginState.updateImage(editorView)({ src: 'atlassian.png' });

    expect(editorView.state.doc).toEqualDocument(doc(p(img({ src: 'atlassian.png' }))));
  });
});
