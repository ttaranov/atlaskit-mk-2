import * as sinon from 'sinon';
import panelPlugins from '../../../src/plugins/panel';
import PanelInputRulesPlugin from '../../../src/plugins/panel/input-rules';
import {
  insertText, doc, p, makeEditor, panel, code_block
} from '@atlaskit/editor-test-helpers';
import { defaultSchema } from '@atlaskit/editor-test-helpers';
import { analyticsService } from '../../../src/analytics';

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
    expect(node.type.name).toEqual('paragraph');
  });

  it('should replace {info} input with panel node of type info', () => {
    const { editorView } = editor(doc(p('{info')));

    const inputRulePlugin = PanelInputRulesPlugin(editorView.state.schema);
    inputRulePlugin!.props.handleTextInput!(editorView, 6, 6, '}');

    expect(editorView.state.doc).toEqualDocument(doc(panel(p())));
    expect(trackEvent.calledWith('atlassian.editor.format.panel.info.autoformatting')).toBe(true);
  });

  it('should not convert {info} inside a code_block', () => {
    const { editorView, sel } = editor(doc(code_block()('{<>}')));

    insertText(editorView, '{info}', sel);

    expect(editorView.state.doc).toEqualDocument(doc(code_block()('\\{info}')));
  });

  it('should replace {note} input with panel node of type note', () => {
    const { editorView } = editor(doc(p('{note')));

    const inputRulePlugin = PanelInputRulesPlugin(editorView.state.schema);
    inputRulePlugin!.props.handleTextInput!(editorView, 6, 6, '}');
    expect(editorView.state.doc.content.child(0).attrs.panelType).toEqual('note');
    expect(trackEvent.calledWith('atlassian.editor.format.panel.note.autoformatting')).toBe(true);
  });

  it('should replace {tip} input with panel node of type tip', () => {
    const { editorView } = editor(doc(p('{tip')));

    const inputRulePlugin = PanelInputRulesPlugin(editorView.state.schema);
    inputRulePlugin!.props.handleTextInput!(editorView, 5, 5, '}');
    expect(editorView.state.doc.content.child(0).attrs.panelType).toEqual('tip');
    expect(trackEvent.calledWith('atlassian.editor.format.panel.tip.autoformatting')).toBe(true);
  });

  it('should replace {warning} input with panel node of type warning', () => {
    const { editorView } = editor(doc(p('{warning')));

    const inputRulePlugin = PanelInputRulesPlugin(editorView.state.schema);
    inputRulePlugin!.props.handleTextInput!(editorView, 9, 9, '}');
    expect(editorView.state.doc.content.child(0).attrs.panelType).toEqual('warning');
    expect(trackEvent.calledWith('atlassian.editor.format.panel.warning.autoformatting')).toBe(true);
  });
});
