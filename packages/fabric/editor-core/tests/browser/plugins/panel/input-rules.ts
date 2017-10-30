import { expect } from 'chai';
import * as sinon from 'sinon';
import panelPlugins from '../../../../src/plugins/panel';
import PanelInputRulesPlugin from '../../../../src/plugins/panel/input-rules';
import {
  insertText, doc, p, makeEditor, panel, code_block, a as link
} from '../../../../src/test-helper';
import defaultSchema from '../../../../src/test-helper/schema';
import { analyticsService } from '../../../../src/analytics';

describe('panel input rules', () => {
  const editor = (doc: any) => makeEditor({
    doc,
    plugins: panelPlugins(defaultSchema),
  });
  let trackEvent;
  beforeEach(() => {
    trackEvent = sinon.spy();
    analyticsService.trackEvent = trackEvent;
  });

  it('should create plain ParagraphNodeType for a random text input', () => {
    const { editorView, sel } = editor(doc(p('{<>}')));
    insertText(editorView, 'testing', sel, sel);
    const node = editorView.state.selection.$to.node();
    expect(node.type.name).to.equal('paragraph');
  });

  it('should replace {info} input with panel node of type info', () => {
    const { editorView } = editor(doc(p('{info')));

    const inputRulePlugin = PanelInputRulesPlugin(editorView.state.schema);
    inputRulePlugin!.props.handleTextInput!(editorView, 6, 6, '}');

    expect(editorView.state.doc).to.deep.equal(doc(panel(p())));
    expect(trackEvent.calledWith('atlassian.editor.format.panel.info.autoformatting')).to.equal(true);
  });

  it('should not replace {info} input inside link with panel node of type info', () => {
    const { editorView } = editor(doc(p(link({ href: 'http://www.atlassian.com' })('{info'), '{<>}')));
    const inputRulePlugin = PanelInputRulesPlugin(editorView.state.schema);
    inputRulePlugin!.props.handleTextInput!(editorView, 6, 6, '}');
    expect(editorView.state.doc).to.deep.equal(doc(p(link({ href: 'http://www.atlassian.com' })('{info'))));
  });

  it('should not convert {info} inside a code_block', () => {
    const { editorView, sel } = editor(doc(code_block()('{<>}')));

    insertText(editorView, '{info}', sel);

    expect(editorView.state.doc).to.deep.equal(doc(code_block()('\\{info}')));
  });

  it('should replace {note} input with panel node of type note', () => {
    const { editorView } = editor(doc(p('{note')));

    const inputRulePlugin = PanelInputRulesPlugin(editorView.state.schema);
    inputRulePlugin!.props.handleTextInput!(editorView, 6, 6, '}');
    expect(editorView.state.doc.content.child(0).attrs.panelType).to.deep.equal('note');
    expect(trackEvent.calledWith('atlassian.editor.format.panel.note.autoformatting')).to.equal(true);
  });

  it('should replace {tip} input with panel node of type tip', () => {
    const { editorView } = editor(doc(p('{tip')));

    const inputRulePlugin = PanelInputRulesPlugin(editorView.state.schema);
    inputRulePlugin!.props.handleTextInput!(editorView, 5, 5, '}');
    expect(editorView.state.doc.content.child(0).attrs.panelType).to.deep.equal('tip');
    expect(trackEvent.calledWith('atlassian.editor.format.panel.tip.autoformatting')).to.equal(true);
  });

  it('should replace {warning} input with panel node of type warning', () => {
    const { editorView } = editor(doc(p('{warning')));

    const inputRulePlugin = PanelInputRulesPlugin(editorView.state.schema);
    inputRulePlugin!.props.handleTextInput!(editorView, 9, 9, '}');
    expect(editorView.state.doc.content.child(0).attrs.panelType).to.deep.equal('warning');
    expect(trackEvent.calledWith('atlassian.editor.format.panel.warning.autoformatting')).to.equal(true);
  });
});
