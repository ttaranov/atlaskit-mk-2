import { expect } from 'chai';
import { mount } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';
import ToolbarHelp from '../../../src/ui/ToolbarHelp';
import HelpDialog from '../../../src/ui/HelpDialog';
import ToolbarButton from '../../../src/ui/ToolbarButton';
import AkButton from '@atlaskit/button';
import { analyticsService } from '../../../src/analytics';

const noop = () => {};

describe('@atlaskit/editor-core/ui/ToolbarHelp', () => {

  it('should trigger analyticsService.trackEvent when help icon is clicked', () => {
    const trackEvent = sinon.spy();
    analyticsService.trackEvent = trackEvent;
    const toolbarOption = mount(<ToolbarHelp showHelp={false} toggleHelp={noop} />);
    toolbarOption.find(AkButton).simulate('click');
    expect(trackEvent.calledWith('atlassian.editor.help.button')).to.equal(true);
    toolbarOption.unmount();
  });

  it('should always have ToolbarButton to open help dialog rendered', () => {
    const toolbarOption = mount(<ToolbarHelp showHelp={false} toggleHelp={noop} />);
    const toolbarButton = toolbarOption.find(ToolbarButton);
    expect(toolbarButton.isEmpty()).to.equal(false);
    expect(toolbarButton.prop('title')).to.equal('Open help dialog');
    toolbarOption.unmount();
  });

  it('should not have HelpDialog by default', () => {
    const toolbarHelp = mount(<ToolbarHelp showHelp={false} toggleHelp={noop} />);
    expect(toolbarHelp.prop('showHelp')).to.equal(false);
    const helpDialog = toolbarHelp.find(HelpDialog);
    expect(helpDialog.isEmpty()).to.equal(true);
    toolbarHelp.unmount();
  });

  it('should have visible HelpDialog if showHelp property is true', () => {
    const toolbarHelp = mount(<ToolbarHelp showHelp={true} toggleHelp={noop} />);
    const helpDialog = toolbarHelp.find(HelpDialog);
    expect(helpDialog.isEmpty()).to.equal(false);
    toolbarHelp.unmount();
  });

  it('should have hidden HelpDialog if closeHelp becomes true', () => {
    const toolbarHelp = mount(<ToolbarHelp showHelp={false} toggleHelp={noop} />);
    toolbarHelp.setProps({ closeHelp: true });
    const helpDialog = toolbarHelp.find(HelpDialog);
    expect(helpDialog.isEmpty()).to.equal(true);
    toolbarHelp.unmount();
  });
});
