// @flow
import React from 'react';
import { mount, shallow } from 'enzyme';
import { Popper } from '@atlaskit/popper';

import InlineDialogWithAnalytics from '../../..';
import { InlineDialogWithoutAnalytics as InlineDialog } from '../..';
import { Container } from '../../styled';

describe('inline-dialog', () => {
  describe('default', () => {
    it('should render any children passed to it', () => {
      const wrapper = mount(
        <InlineDialog>
          <div id="children" />
        </InlineDialog>,
      );
      expect(wrapper.find('#children').exists()).toBe(true);
    });
  });

  describe('isOpen prop', () => {
    it('should render the content container if isOpen is set', () => {
      const wrapper = mount(<InlineDialog isOpen />);
      expect(wrapper.find(Container).exists()).toBe(true);
    });

    it('should not render the content container if isOpen is not set', () => {
      const wrapper = mount(<InlineDialog />);
      expect(wrapper.find(Container).exists()).toBe(false);
    });
  });

  describe('content prop', () => {
    const content = <div id="someContent">This is some content</div>;

    it('should render content if isOpen is set', () => {
      const wrapper = mount(<InlineDialog content={content} isOpen />);
      expect(wrapper.find('#someContent').exists()).toBe(true);
    });

    it('should not render content if isOpen is not set', () => {
      const wrapper = mount(<InlineDialog content={content} />);
      expect(wrapper.find('#content').exists()).toBe(false);
    });
  });

  describe('placement prop', () => {
    it('should be reflected onto the Popper component', () => {
      const wrapper = shallow(<InlineDialog placement="right" isOpen />);
      const popper = wrapper.find(Popper);

      expect(popper.length).toBeGreaterThan(0);
      expect(popper.prop('placement')).toBe('right');
    });
  });

  describe('onContentClick', () => {
    it('should be triggered when the content is clicked', () => {
      const spy = jest.fn();
      const dummyContent = <div id="dummyContent">This is some content</div>;
      const wrapper = mount(
        <InlineDialog onContentClick={spy} content={dummyContent} isOpen>
          <div>trigger</div>
        </InlineDialog>,
      );
      wrapper.find('#dummyContent').simulate('click');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onContentFocus', () => {
    it('should be triggered when an element in the content is focused', () => {
      const spy = jest.fn();
      const dummyLink = (
        <a id="dummyLink" href="/test">
          a link
        </a>
      );
      const wrapper = mount(
        <InlineDialog onContentFocus={spy} content={dummyLink} isOpen />,
      );

      wrapper.find('#dummyLink').simulate('focus');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onContentBlur', () => {
    it('should be triggered when an element in the content is blurred', () => {
      const spy = jest.fn();
      const dummyLink = (
        <a id="dummyLink" href="/test">
          a link
        </a>
      );
      const wrapper = mount(
        <InlineDialog onContentBlur={spy} content={dummyLink} isOpen />,
      );

      wrapper.find('#dummyLink').simulate('blur');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleClickOutside', () => {
    it('should not trigger the onClose prop if event is defaultPrevented', () => {
      const spy = jest.fn();
      const wrapper = mount(<InlineDialog onClose={spy} isOpen />);
      const event = {
        target: document.createElement('div'),
        defaultPrevented: true,
      };

      wrapper.instance().handleClickOutside(event);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should trigger the onClose prop', () => {
      const spy = jest.fn();
      const wrapper = mount(<InlineDialog onClose={spy} isOpen />);
      const event = {
        target: document.createElement('div'),
      };

      wrapper.instance().handleClickOutside(event);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].isOpen).toBe(false);
    });

    it('should NOT trigger the onClose prop when isOpen is false', () => {
      const spy = jest.fn();
      const wrapper = mount(<InlineDialog onClose={spy} />);
      const event = {
        target: document.createElement('div'),
      };

      wrapper.instance().handleClickOutside(event);

      expect(spy).not.toHaveBeenCalled();
    });
  });
});

describe('InlineDialogWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
  });

  it('should mount without errors', () => {
    mount(<InlineDialogWithAnalytics />);
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
