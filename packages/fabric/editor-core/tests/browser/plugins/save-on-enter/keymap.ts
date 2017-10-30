import * as chai from 'chai';
import { expect } from 'chai';
import * as sinon from 'sinon';
import tasksAndDecisionsPlugins from '../../../../src/plugins/tasks-and-decisions';
import { createPlugin as createSaveOnEnterPlugin } from '../../../../src/editor/plugins/save-on-enter';
import {
  chaiPlugin,
  makeEditor,
  doc,
  p,
  decisionList,
  decisionItem,
  sendKeyToPm,
  taskList,
  taskItem,
} from '../../../../src/test-helper';
import defaultSchema from '../../../../src/test-helper/schema';
import { Plugin } from 'prosemirror-state';

chai.use(chaiPlugin);

describe('save on enter', () => {

  const onSaveSpy = sinon.spy();

  before(() => {
    onSaveSpy.reset();
  });

  const editor = (doc: any) => makeEditor({
    doc,
    plugins: [
      createSaveOnEnterPlugin(onSaveSpy) as Plugin,
      ...tasksAndDecisionsPlugins(defaultSchema),
    ]
  });

  it('should trigger onSubmit when user presses Enter', () => {
    const { editorView } = editor(doc(p('1{<>}')));

    sendKeyToPm(editorView!, 'Enter');
    expect(onSaveSpy.calledWith(editorView)).to.equal(true);
  });

  it('should trigger onSubmit when user presses Enter in decisionItem', () => {
    const { editorView } = editor(doc((decisionList(decisionItem('1{<>}')))));
    sendKeyToPm(editorView!, 'Enter');
    expect(onSaveSpy.calledWith(editorView)).to.equal(true);
  });

  it('should trigger onSubmit when user presses Enter inside taskItem', () => {
    const { editorView } = editor(doc((taskList(taskItem('1{<>}')))));
    sendKeyToPm(editorView!, 'Enter');
    expect(onSaveSpy.calledWith(editorView)).to.equal(true);
  });

  it('should not trigger onSubmit when user presses Enter in empty decisionItem', () => {
    const { editorView } = editor(doc((decisionList(decisionItem('{<>}')))));
    sendKeyToPm(editorView!, 'Enter');
    expect(onSaveSpy.calledWith(editorView)).to.equal(false);
  });

  it('should not trigger onSubmit when user presses Enter inside empty taskItem', () => {
    const { editorView } = editor(doc((taskList(taskItem('{<>}')))));
    sendKeyToPm(editorView!, 'Enter');
    expect(onSaveSpy.calledWith(editorView)).to.equal(false);
  });
});
