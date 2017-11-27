import { mount } from 'enzyme';
import * as React from 'react';
import ToolbarHelp from '../../src/ui/ToolbarHelp';
import HelpDialog from '../../src/ui/HelpDialog';
import ToolbarButton from '../../src/ui/ToolbarButton';
import AkButton from '@atlaskit/button';
import { analyticsService } from '../../src/analytics';

const noop = () => {};

describe('@atlaskit/editor-core/ui/ToolbarHelp', () => {
  it('should trigger analyticsService.trackEvent when help icon is clicked', () => {
    const trackEvent = jest.fn();
    analyticsService.trackEvent = trackEvent;
    const toolbarOption = mount(
      <ToolbarHelp showHelp={false} toggleHelp={noop} />,
    );
    toolbarOption.find(AkButton).simulate('click');
    expect(trackEvent).toHaveBeenCalledWith('atlassian.editor.help.button');
    toolbarOption.unmount();
  });

  it('should always have ToolbarButton to open help dialog rendered', () => {
    const toolbarOption = mount(
      <ToolbarHelp showHelp={false} toggleHelp={noop} />,
    );
    const toolbarButton = toolbarOption.find(ToolbarButton);
    expect(toolbarButton.isEmpty()).toBe(false);
    expect(toolbarButton.prop('title')).toEqual('Open help dialog');
    toolbarOption.unmount();
  });

  it('should not have HelpDialog by default', () => {
    const toolbarHelp = mount(
      <ToolbarHelp showHelp={false} toggleHelp={noop} />,
    );
    expect(toolbarHelp.prop('showHelp')).toBe(false);
    const helpDialog = toolbarHelp.find(HelpDialog);
    expect(helpDialog.isEmpty()).toBe(true);
    toolbarHelp.unmount();
  });

  it('should have visible HelpDialog if showHelp property is true', () => {
    const toolbarHelp = mount(
      <ToolbarHelp showHelp={true} toggleHelp={noop} />,
    );
    const helpDialog = toolbarHelp.find(HelpDialog);
    expect(helpDialog.isEmpty()).toBe(false);
    toolbarHelp.unmount();
  });

  it('should have hidden HelpDialog if closeHelp becomes true', () => {
    const toolbarHelp = mount(
      <ToolbarHelp showHelp={false} toggleHelp={noop} />,
    );
    toolbarHelp.setProps({ closeHelp: true });
    const helpDialog = toolbarHelp.find(HelpDialog);
    expect(helpDialog.isEmpty()).toBe(true);
    toolbarHelp.unmount();
  });
});
