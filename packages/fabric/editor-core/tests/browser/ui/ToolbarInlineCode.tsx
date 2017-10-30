import { expect } from 'chai';
import { mount } from 'enzyme';
import * as sinon from 'sinon';
import * as React from 'react';
import textFormattingPlugins, { TextFormattingState } from '../../../src/plugins/text-formatting';
import ToolbarInlineCode from '../../../src/ui/ToolbarInlineCode';
import ToolbarButton from '../../../src/ui/ToolbarButton';
import AkButton from '@atlaskit/button';
import { doc, p, makeEditor } from '../../../src/test-helper';
import defaultSchema from '../../../src/test-helper/schema';
import { analyticsService } from '../../../src/analytics';

describe('@atlaskit/editor-core/ui/ToolbarInlineCode', () => {
  const editor = (doc: any) => makeEditor<TextFormattingState>({
    doc,
    plugins: textFormattingPlugins(defaultSchema),
  });

  it('should render disabled ToolbarButton if disabled property is true', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const codeButton = mount(
      <ToolbarInlineCode
        disabled={true}
        pluginState={pluginState}
        editorView={editorView}
      />
    );

    expect(codeButton.find(ToolbarButton).prop('disabled')).to.equal(true);
    codeButton.unmount();
  });

  it('should trigger toggleCode in pluginState when clicked', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const codeButton = mount(
      <ToolbarInlineCode
        pluginState={pluginState}
        editorView={editorView}
      />
    );

    const spyFunc = sinon.spy();
    pluginState.toggleCode = spyFunc;
    codeButton.find('button').simulate('click');
    expect(spyFunc.callCount).to.equal(1);
    codeButton.unmount();
  });

  it('should not render button if isEnabled is false', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const codeButton = mount(
      <ToolbarInlineCode
        pluginState={pluginState}
        editorView={editorView}
      />
    );

    codeButton.setState({ isEnabled: false });
    expect(codeButton.find(ToolbarButton).length).to.equal(0);
    codeButton.unmount();
  });

  describe('analytics', () => {
    it('should trigger analyticsService.trackEvent', () => {
      const trackEvent = sinon.spy();
      analyticsService.trackEvent = trackEvent;
      const { editorView, pluginState } = editor(doc(p('text')));
      const toolbarOption = mount(
        <ToolbarInlineCode
          pluginState={pluginState}
          editorView={editorView}
        />
      );
      toolbarOption.find(AkButton).simulate('click');
      expect(trackEvent.calledWith('atlassian.editor.format.code.toggle')).to.equal(true);
      toolbarOption.unmount();
    });
  });
});
