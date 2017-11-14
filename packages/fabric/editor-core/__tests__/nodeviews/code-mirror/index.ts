import { makeEditor, doc, code_block, defaultSchema } from '@atlaskit/editor-test-helpers';
import { CodeBlockState, codeBlockPlugins } from '../../../src/plugins';
import codeMirrorPlugins from '../../../src/plugins/code-mirror';
import codeMirrorNodeView from '../../../src/nodeviews/ui/code-mirror';

describe('@atlaskit/nodeviews/code-mirror', () => {
  const editor = (doc: any) => makeEditor({
    doc,
    plugins: [
      ...codeBlockPlugins(defaultSchema),
      ...codeMirrorPlugins(defaultSchema),
    ],
    nodeViews: { codeBlock: codeMirrorNodeView },
  });

  it('should export code-mirror nodeview factory', () => {
    expect(codeMirrorNodeView instanceof Function).toBe(true);
  });

  it('should be possible to create a code-block', () => {
    const { editorView } = editor(doc(code_block({ language: 'java' })('{<>}codeBlock')));
    const node = editorView.state.selection.$from.node(1);
    expect(node.type.name).toEqual('codeBlock');
    editorView.destroy();
  });

 it('should return a defined codeMirrorNodeView object', () => {
    const { editorView } = editor(doc(code_block({ language: 'java' })('{<>}codeBlock')));
    const node = editorView.state.selection.$from.node(1);
    const codeNodeView = codeMirrorNodeView(node, editorView, () => 0);
    expect(codeNodeView).not.toBe(undefined);
    editorView.destroy();
  });

 it('should have dom defined as public member of codeMirrorNodeView object', () => {
    const { editorView } = editor(doc(code_block({ language: 'java' })('{<>}codeBlock')));
    const node = editorView.state.selection.$from.node(1);
    const codeNodeView = codeMirrorNodeView(node, editorView, () => 0);
    expect(codeNodeView).not.toBe(undefined);
    expect(codeNodeView.update).not.toBe(undefined);
    expect(codeNodeView.selectNode).not.toBe(undefined);
    expect(codeNodeView.destroy).not.toBe(undefined);
    editorView.destroy();
  });

 it('should have callBacks defined as public member of codeMirrorNodeView object', () => {
    const { editorView } = editor(doc(code_block({ language: 'java' })('{<>}codeBlock')));
    const node = editorView.state.selection.$from.node(1);
    const codeNodeView = codeMirrorNodeView(node, editorView, () => 0);
    expect(codeNodeView).not.toBe(undefined);
    expect(codeNodeView.update).not.toBe(undefined);
    expect(codeNodeView.selectNode).not.toBe(undefined);
    expect(codeNodeView.stopEvent).not.toBe(undefined);
    expect(codeNodeView.destroy).not.toBe(undefined);
    editorView.destroy();
  });

  it('should add a uniqueId to code block node', () => {
    const { editorView } = editor(doc(code_block({ language: 'java' })('{<>}codeBlock')));
    const node = editorView.state.selection.$from.node(1);
    expect(!!node.attrs['uniqueId']).toBe(true);
    editorView.destroy();
  });

  it('should add a isCodeMirror to code block node', () => {
    const { editorView } = editor(doc(code_block({ language: 'java' })('{<>}codeBlock')));
    const node = editorView.state.selection.$from.node(1);
    expect(!!node.attrs['isCodeMirror']).toBe(true);
    editorView.destroy();
  });

    it('should call unsubscribeFocusHandlers menthod of code-block plugin editor is destroyed', () => {
    const { editorView, pluginStates } = editor(doc(code_block({ language: 'java' })('{<>}codeBlock')));
    const func = jest.fn();
    const codeBlockPlugin = pluginStates.filter(state => state instanceof CodeBlockState);
    expect(codeBlockPlugin.length).toBeGreaterThan(0);
    codeBlockPlugin[0].unsubscribeFocusHandlers = func;
    editorView.destroy();
    expect(func).toHaveBeenCalled();
  });

  it('should call unsubscribe menthod of code-block plugin editor is destroyed', () => {
    const { editorView, pluginStates } = editor(doc(code_block({ language: 'java' })('{<>}codeBlock')));
    const func = jest.fn();
    const codeBlockPlugin = pluginStates.filter(state => state instanceof CodeBlockState);
    expect(codeBlockPlugin.length).toBeGreaterThan(0);
    codeBlockPlugin[0].unsubscribe = func;
    editorView.destroy();
    expect(func).toHaveBeenCalled();
  });
});
