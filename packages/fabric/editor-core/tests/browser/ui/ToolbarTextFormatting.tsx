import { expect } from 'chai';
import { mount } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';
import textFormattingPlugin, { TextFormattingState } from '../../../src/plugins/text-formatting';
import ToolbarButton from '../../../src/ui/ToolbarButton';
import AkButton from '@atlaskit/button';
import ToolbarTextFormatting from '../../../src/ui/ToolbarTextFormatting';
import { doc, p, makeEditor } from '../../../src/test-helper';
import defaultSchema from '../../../src/test-helper/schema';
import { analyticsService } from '../../../src/analytics';

describe('ToolbarTextFormatting', () => {
  const editor = (doc: any) => makeEditor<TextFormattingState>({
    doc,
    plugins: textFormattingPlugin(defaultSchema),
  });

  it('should render disabled ToolbarButtons if disabled property is true', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const toolbarTextColor = mount(
      <ToolbarTextFormatting
        disabled={true}
        pluginState={pluginState}
        editorView={editorView}
      />
    );

    toolbarTextColor.find(ToolbarButton).forEach(node => {
      expect(node.prop('disabled')).to.equal(true);
    });
    toolbarTextColor.unmount();
  });

  describe('analytics', () => {
    let trackEvent;
    let toolbarOption;
    beforeEach(() => {
      const { editorView, pluginState } = editor(doc(p('text')));
      toolbarOption = mount(
        <ToolbarTextFormatting
          pluginState={pluginState}
          editorView={editorView}
        />
      );
      trackEvent = sinon.spy();
      analyticsService.trackEvent = trackEvent;
    });

    afterEach(() => {
      toolbarOption.unmount();
    });

    it('should trigger analyticsService.trackEvent when bold button is clicked', () => {
      toolbarOption.find(AkButton).first().simulate('click');
      expect(trackEvent.calledWith('atlassian.editor.format.strong.button')).to.equal(true);
    });

    it('should trigger analyticsService.trackEvent when italic button is clicked', () => {
      toolbarOption.find(AkButton).at(1).simulate('click');
      expect(trackEvent.calledWith('atlassian.editor.format.em.button')).to.equal(true);
    });
  });
});
