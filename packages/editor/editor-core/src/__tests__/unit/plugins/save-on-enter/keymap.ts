import {
  createEditor,
  doc,
  p,
  decisionList,
  decisionItem,
  sendKeyToPm,
  taskList,
  taskItem,
} from '@atlaskit/editor-test-helpers';
import saveOnEnterPlugin from '../../../../plugins/save-on-enter';
import tasksAndDecisionsPlugin from '../../../../plugins/tasks-and-decisions';

describe('save on enter', () => {
  const onSaveSpy = jest.fn();

  beforeEach(() => {
    onSaveSpy.mockReset();
  });

  const editor = (doc: any) =>
    createEditor({
      doc,
      editorPlugins: [saveOnEnterPlugin, tasksAndDecisionsPlugin],
      editorProps: {
        onSave: onSaveSpy,
      },
    });

  it('should trigger onSubmit when user presses Enter', () => {
    const { editorView } = editor(doc(p('1{<>}')));

    sendKeyToPm(editorView!, 'Enter');
    expect(onSaveSpy).toHaveBeenCalledWith(editorView);
  });

  it('should trigger onSubmit when user presses Enter in decisionItem', () => {
    const { editorView } = editor(doc(decisionList()(decisionItem()('1{<>}'))));
    sendKeyToPm(editorView!, 'Enter');
    expect(onSaveSpy).toHaveBeenCalledWith(editorView);
  });

  it('should trigger onSubmit when user presses Enter inside taskItem', () => {
    const { editorView } = editor(doc(taskList()(taskItem()('1{<>}'))));
    sendKeyToPm(editorView!, 'Enter');
    expect(onSaveSpy).toHaveBeenCalledWith(editorView);
  });

  it('should not trigger onSubmit when user presses Enter in empty decisionItem', () => {
    const { editorView } = editor(doc(decisionList()(decisionItem()('{<>}'))));
    sendKeyToPm(editorView!, 'Enter');
    expect(onSaveSpy).not.toHaveBeenCalledWith(editorView);
  });

  it('should not trigger onSubmit when user presses Enter inside empty taskItem', () => {
    const { editorView } = editor(doc(taskList()(taskItem()('{<>}'))));
    sendKeyToPm(editorView!, 'Enter');
    expect(onSaveSpy).not.toHaveBeenCalledWith(editorView);
  });
});
