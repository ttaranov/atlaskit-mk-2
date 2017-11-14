import { mount } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';
import * as keymaps from '../../src/keymaps';
import ToolbarHelp from '../../src/ui/ToolbarHelp';
import { getComponentFromKeymap, formatting } from '../../src/ui/HelpDialog';
import AkButton from '@atlaskit/button';
import { analyticsService } from '../../src/analytics';
import { browser } from '@atlaskit/editor-common';

const noop = () => {};

describe('@atlaskit/editor-core/ui/HelpDialog', () => {

  it('should call toggleHelp when open help button is clicked', () => {
    const spy = sinon.spy();
    const toolbarHelp = mount(<ToolbarHelp  showHelp={false} toggleHelp={spy} />);
    toolbarHelp.find(AkButton).simulate('click');
    expect(spy.callCount).toEqual(1);
    toolbarHelp.unmount();
  });

  it('should call analytics event when open help button is clicked', () => {
    const trackEvent = sinon.spy();
    analyticsService.trackEvent = trackEvent;
    const toolbarHelp = mount(<ToolbarHelp  showHelp={false} toggleHelp={noop} />);
    toolbarHelp.find(AkButton).simulate('click');
    expect(trackEvent.calledWith('atlassian.editor.help.button')).toBe(true);
    toolbarHelp.unmount();
  });

  it('should call toggleHelp when wrapping div is clicked', () => {
    const spy = sinon.spy();
    const toolbarHelp = mount(<ToolbarHelp  showHelp={false} toggleHelp={spy} />);
    toolbarHelp.find(AkButton).simulate('click');
    expect(spy.callCount).toEqual(1);
    toolbarHelp.unmount();
  });

  it('should return correct description of codemap when getComponentFromKeymap is called', () => {
    const key = getComponentFromKeymap(keymaps.toggleBold);
    const shortcut = mount(<div>{key}</div>);
    if (browser.mac) {
      expect(shortcut.text()).toEqual('⌘ + b');
    } else {
      expect(shortcut.text()).toEqual('ctrl + b');
    }
    shortcut.unmount();
  });

  describe('formatting', () => {
    it('should be an array for verious formattings supported', () => {
      expect(formatting instanceof Array).toBe(true);
    });

    it('should have value defined for quote', () => {
      expect(formatting.filter(f => f.name === 'Bold').length).toEqual(1);
      expect(formatting.filter(f => f.name === 'Quote').length).toEqual(1);
      expect(formatting.filter(f => f.name === 'Link').length).toEqual(1);
    });

    it('should have a value of type keymap in keymap property', () => {
      expect(formatting.filter(f => f.name === 'Quote')[0].keymap === keymaps.toggleBlockQuote).toBe(true);
    });

    it('should have correct value for auto-formatting', () => {
      const autoformat = formatting.filter(f => f.name === 'Quote')[0].autoFormatting;
      const label = mount(<div>{autoformat!()}</div>);
      expect(label.text()).toEqual('> + space');
      label.unmount();
    });
  });
});
