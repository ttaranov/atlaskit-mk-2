// @flow
import React from 'react';
import { mount, shallow } from 'enzyme';
import Layer from '@atlaskit/layer';

import InlineDialog from '../src';
import InlineDialogWithAnalytics from '../src/InlineDialog/index';
import { Container } from '../src/InlineDialog/styled';

describe('inline-dialog', () => {
  describe('default', () => {
    it('should have the expected default props', () => {
      const wrapper = mount(<InlineDialog />);

      expect(wrapper.prop('position')).toBe('bottom center');
      expect(wrapper.prop('isOpen')).toBe(false);
      expect(wrapper.prop('content')).toBe(undefined);
      expect(wrapper.prop('shouldFlip')).toBe(false);
    });

    it('should pass the expected default props to Layer', () => {
      const wrapper = mount(<InlineDialog />);
      const layer = wrapper.find(Layer);
      expect(layer.prop('autoFlip')).toBe(false);
      expect(layer.prop('content')).toBe(null);
      expect(layer.prop('position')).toBe('bottom center');
      expect(layer.prop('offset')).toBe('0 8');
    });

    it('should render any children passed to it', () => {
      const wrapper = shallow(
        <InlineDialog>
          <div id="children" />
        </InlineDialog>,
      );
      expect(wrapper.find('#children').exists()).toBe(true);
    });
  });

  describe('boundariesElement prop', () => {
    it('should be reflected onto the Layer component', () => {
      const wrapper = shallow(
        <InlineDialog boundariesElement="scrollParent" />,
      );
      const layer = wrapper.find(Layer);
      expect(layer.length).toBeGreaterThan(0);
      expect(layer.prop('boundariesElement')).toBe('scrollParent');
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

    it('should reflect content prop onto Layer if isOpen is set', () => {
      const wrapper = shallow(<InlineDialog content={content} isOpen />);
      const layer = wrapper.find(Layer);
      const foo = shallow(layer.prop('content'));
      expect(foo.find('#someContent').length).toBeGreaterThan(0);
    });
  });

  describe('position prop', () => {
    it('should be reflected onto the Layer component', () => {
      const wrapper = shallow(<InlineDialog position="right middle" />);
      const layer = wrapper.find(Layer);
      expect(layer.length).toBeGreaterThan(0);
      expect(layer.prop('position')).toBe('right middle');
    });
  });

  describe('shouldFlip prop', () => {
    describe('should be reflected onto the Layer component', () => {
      it('for a boolean value', () => {
        const wrapper = mount(<InlineDialog shouldFlip />);
        const layer = wrapper.find(Layer);
        expect(layer.length).toBeGreaterThan(0);
        expect(layer.prop('autoFlip')).toBe(true);
      });

      it('for an array of strings', () => {
        const shouldFlipValue = ['top', 'bottom'];
        const wrapper = mount(<InlineDialog shouldFlip={shouldFlipValue} />);
        const layer = wrapper.find(Layer);
        expect(layer.length).toBeGreaterThan(0);
        expect(layer.prop('autoFlip')).toBe(shouldFlipValue);
      });
    });
  });

  describe('onContentClick', () => {
    it('should be triggered when the content is clicked', () => {
      const spy = jest.fn();
      const wrapper = mount(
        <InlineDialog
          onContentClick={spy}
          content={<div>content</div>}
          isOpen
        />,
      );
      const content = mount(wrapper.find(Layer).props().content);

      content.simulate('click');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onContentFocus', () => {
    it('should be triggered when an element in the content is focused', () => {
      const spy = jest.fn();
      const linkEl = (
        <a id="link" href="/test">
          a link
        </a>
      );
      const wrapper = mount(
        <InlineDialog onContentFocus={spy} content={linkEl} isOpen />,
      );
      const content = mount(wrapper.find(Layer).props().content);

      content.find('#link').simulate('focus');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onContentBlur', () => {
    it('should be triggered when an element in the content is blurred', () => {
      const spy = jest.fn();
      const linkEl = (
        <a id="link" href="/test">
          a link
        </a>
      );
      const wrapper = mount(
        <InlineDialog onContentBlur={spy} content={linkEl} isOpen />,
      );
      const content = mount(wrapper.find(Layer).props().content);

      content.find('#link').simulate('blur');
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
