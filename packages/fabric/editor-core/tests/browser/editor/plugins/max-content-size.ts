import createEditor from '../../../helpers/create-editor';
import maxContentSize from '../../../../src/editor/plugins/max-content-size';
import { expect } from 'chai';

describe('editor/plugins/max-content-size', () => {
  it('should not allow document to grow more than specified max content size', () => {
    const { editorView } = createEditor([maxContentSize], { maxContentSize: 10 });
    editorView.dispatch(editorView.state.tr.insertText('12345678910'));
    expect(editorView.state.doc.nodeSize).to.be.lessThan(10);
    editorView.destroy();
  });

  it('should allow document to grow upto specified max content size', () => {
    const { editorView } = createEditor([maxContentSize], { maxContentSize: 10 });
    editorView.dispatch(editorView.state.tr.insertText('123456'));
    expect(editorView.state.doc.nodeSize).to.equal(10);
    editorView.destroy();
  });
});
