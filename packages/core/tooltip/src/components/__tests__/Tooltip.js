// @flow

import React from 'react';

import { shallow, mount, ReactWrapper } from 'enzyme';
import 'jest-styled-components';
import Tooltip, { marshal } from '../Tooltip';
import getPosition from '../utils/getPosition';

// Variables starting with mock are executed before jest.mock's hoisting
// See https://facebook.github.io/jest/docs/en/es6-class-mocks.html#calling-jestmock-jest-docs-en-jest-objecthtml-jestmockmodulename-factory-options-with-the-module-factory-parameter
let mockStatus;
jest.mock('react-transition-group/Transition', () => {
  const MockTransition = ({ children }) => children(mockStatus);
  return MockTransition;
});

let mockPosition;
jest.mock('../utils/getPosition', () => {
  return jest.fn(() => mockPosition);
});
jest.useFakeTimers();

function getPortalContents(wrapper) {
  // Layer Manager's portal renders its content after a setTimeout
  jest.runAllTimers();
  wrapper.update();
  const instance = wrapper.find('Portal').instance();
  return new ReactWrapper(instance.props.children);
}

function mountBase(element) {
  return mount(shallow(element).get(0));
}

describe('Tooltip', () => {
  beforeEach(() => {
    // $FlowFixMe - mocked import
    getPosition.mockClear();
    mockStatus = 'exited';
    mockPosition = {
      coordinates: {
        left: 50,
        top: 100,
      },
      mousePosition: 'bottom',
      position: 'right',
    };
  });
  it('should be possible to create a component', () => {
    const wrapper = shallow(
      <Tooltip>
        <div>foo</div>
      </Tooltip>,
    );
    expect(wrapper).not.toBe(undefined);
  });

  describe('show method', () => {
    it('should update correct state with immediate true', () => {
      const wrapper = shallow(
        <Tooltip>
          <div>foo</div>
        </Tooltip>,
      ).dive();

      const instance = wrapper.instance();

      expect(wrapper.state()).toEqual(
        expect.objectContaining({
          isVisible: false,
          coordinates: null,
        }),
      );

      instance.show({ immediate: true });

      expect(wrapper.state()).toEqual(
        expect.objectContaining({
          immediatelyShow: true,
          isVisible: true,
          coordinates: null,
        }),
      );
    });

    it('should update correct state with immediate false', () => {
      const wrapper = shallow(
        <Tooltip>
          <div>foo</div>
        </Tooltip>,
      ).dive();

      const instance = wrapper.instance();

      expect(wrapper.state()).toEqual(
        expect.objectContaining({
          isVisible: false,
          coordinates: null,
        }),
      );

      instance.show({ immediate: false });

      expect(wrapper.state()).toEqual(
        expect.objectContaining({
          immediatelyShow: false,
          isVisible: true,
          coordinates: null,
        }),
      );
    });
  });

  describe('hide method', () => {
    it('should update correct state with immediate true', () => {
      const wrapper = shallow(
        <Tooltip>
          <div>foo</div>
        </Tooltip>,
      ).dive();

      const instance = wrapper.instance();

      instance.show({ immediate: true });

      expect(wrapper.state()).toEqual(
        expect.objectContaining({
          isVisible: true,
          coordinates: null,
        }),
      );

      instance.hide({ immediate: true });

      expect(wrapper.state()).toEqual(
        expect.objectContaining({
          immediatelyHide: true,
          isVisible: false,
          coordinates: null,
        }),
      );
    });

    it('should update correct state with immediate false', () => {
      const wrapper = shallow(
        <Tooltip>
          <div>foo</div>
        </Tooltip>,
      ).dive();

      const instance = wrapper.instance();

      instance.show({ immediate: true });

      expect(wrapper.state()).toEqual(
        expect.objectContaining({
          isVisible: true,
          coordinates: null,
        }),
      );

      instance.hide({ immediate: false });

      expect(wrapper.state()).toEqual(
        expect.objectContaining({
          immediatelyHide: false,
          isVisible: false,
          coordinates: null,
        }),
      );
    });
  });

  describe('mousing over', () => {
    it("should delegate to the marshal's show method", () => {
      const spy = jest.spyOn(marshal, 'show');
      const wrapper = shallow(
        <Tooltip>
          <div>foo</div>
        </Tooltip>,
      ).dive();
      const instance = wrapper.instance();

      expect(spy).not.toHaveBeenCalled();
      wrapper.simulate('mouseOver', {
        target: {},
      });
      expect(spy).toHaveBeenCalledWith(instance);
      spy.mockRestore();
    });

    it('should call onMouseOver prop callback', () => {
      const spy = jest.fn();
      const event = {
        target: {},
      };
      const wrapper = shallow(
        <Tooltip onMouseOver={spy}>
          <div>foo</div>
        </Tooltip>,
      ).dive();

      expect(spy).not.toHaveBeenCalled();
      wrapper.simulate('mouseOver', event);
      expect(spy).toHaveBeenCalledWith(event);
    });

    it('should have no effect if mouse over target is wrapper', () => {
      const mouseOverSpy = jest.fn();
      const marshalSpy = jest.spyOn(marshal, 'show');
      const wrapper = shallow(
        <Tooltip onMouseOver={mouseOverSpy}>
          <div>foo</div>
        </Tooltip>,
      ).dive();
      const instance = wrapper.instance();

      expect(mouseOverSpy).not.toHaveBeenCalled();
      expect(marshalSpy).not.toHaveBeenCalled();

      wrapper.simulate('mouseOver', {
        target: instance.wrapper,
      });

      expect(mouseOverSpy).not.toHaveBeenCalled();
      expect(marshalSpy).not.toHaveBeenCalled();
      marshalSpy.mockRestore();
    });
  });

  describe('mousing out', () => {
    it("should delegate to the marshal's hide method", () => {
      const spy = jest.spyOn(marshal, 'hide');
      const wrapper = shallow(
        <Tooltip>
          <div>foo</div>
        </Tooltip>,
      ).dive();
      const instance = wrapper.instance();

      expect(spy).not.toHaveBeenCalled();
      wrapper.simulate('mouseOut', {
        target: {},
      });
      expect(spy).toHaveBeenCalledWith(instance);
      spy.mockRestore();
    });

    it('should call onMouseOut prop callback', () => {
      const spy = jest.fn();
      const event = {
        target: {},
      };
      const wrapper = shallow(
        <Tooltip onMouseOut={spy}>
          <div>foo</div>
        </Tooltip>,
      ).dive();

      expect(spy).not.toHaveBeenCalled();
      wrapper.simulate('mouseOut', event);
      expect(spy).toHaveBeenCalledWith(event);
    });

    it('should have no effect if mouse out target is wrapper', () => {
      const mouseOutSpy = jest.fn();
      const marshalSpy = jest.spyOn(marshal, 'hide');
      const wrapper = shallow(
        <Tooltip onMouseOut={mouseOutSpy}>
          <div>foo</div>
        </Tooltip>,
      ).dive();
      const instance = wrapper.instance();

      expect(mouseOutSpy).not.toHaveBeenCalled();
      expect(marshalSpy).not.toHaveBeenCalled();

      wrapper.simulate('mouseOut', {
        target: instance.wrapper,
      });

      expect(mouseOutSpy).not.toHaveBeenCalled();
      expect(marshalSpy).not.toHaveBeenCalled();
      marshalSpy.mockRestore();
    });
  });
  describe('mousemove events', () => {
    it('should update the mouseCoordinates var', () => {
      const wrapper = shallow(
        <Tooltip>
          <div>foo</div>
        </Tooltip>,
      ).dive();
      const instance = wrapper.instance();

      expect(instance.mouseCoordinates).toBeNull();

      wrapper.simulate('mouseMove', {
        clientX: 50,
        clientY: 100,
      });
      expect(instance.mouseCoordinates).toEqual({
        left: 50,
        top: 100,
      });
    });
  });
  describe('click', () => {
    it('should not hide the tooltip by default', () => {
      const wrapper = shallow(
        <Tooltip>
          <div>foo</div>
        </Tooltip>,
      ).dive();
      const instance = wrapper.instance();
      instance.hide = jest.fn();

      instance.show({ immediate: true });

      expect(instance.hide).not.toHaveBeenCalled();
      wrapper.simulate('click');

      expect(instance.hide).not.toHaveBeenCalled();
    });
    it('should hide the tooltip if the hideTooltipOnClick prop is true', () => {
      const wrapper = shallow(
        <Tooltip hideTooltipOnClick>
          <div>foo</div>
        </Tooltip>,
      ).dive();
      const instance = wrapper.instance();
      instance.hide = jest.fn();

      instance.show({ immediate: true });

      expect(instance.hide).not.toHaveBeenCalled();
      wrapper.simulate('click');

      expect(instance.hide).toHaveBeenCalledWith({ immediate: true });
    });
  });

  describe('render', () => {
    it('should use a div by default for the wrapping element', () => {
      const wrapper = shallow(
        <Tooltip>
          <div>foo</div>
        </Tooltip>,
      ).dive();

      expect(wrapper.name()).toBe('div');
    });

    it('should use the wrapping element specified by the tag prop', () => {
      const wrapper = shallow(
        <Tooltip tag="span">
          <div>foo</div>
        </Tooltip>,
      ).dive();

      expect(wrapper.name()).toBe('span');
    });

    it('should not render the tooltip by default', () => {
      const wrapper = shallow(
        <Tooltip>
          <div>foo</div>
        </Tooltip>,
      ).dive();
      expect(wrapper.children().equals(<div>foo</div>)).toBe(true);
    });

    it('should render a tooltip after show method is called', () => {
      mockStatus = 'entered';
      const wrapper = mountBase(
        <Tooltip content="Tooltip content">
          <div>foo</div>
        </Tooltip>,
      );

      const instance = wrapper.instance();
      instance.show({ immediate: true });
      wrapper.update();

      const tooltip = getPortalContents(wrapper);
      expect(tooltip.text()).toBe('Tooltip content');
    });

    it('should not render a tooltip if no content prop provided', () => {
      const wrapper = shallow(
        <Tooltip>
          <div>foo</div>
        </Tooltip>,
      ).dive();
      const instance = wrapper.instance();
      instance.show({ immediate: true });

      expect(wrapper.children().equals(<div>foo</div>)).toBe(true);
    });

    it('should call getPosition to get the correct tooltip position before showing tooltip', () => {
      const wrapper = mountBase(
        <Tooltip content="Tooltip content" position="left">
          <div>foo</div>
        </Tooltip>,
      );

      wrapper.simulate('mouseMove', {
        clientX: 50,
        clientY: 100,
      });

      expect(wrapper.state()).toEqual(
        expect.objectContaining({
          coordinates: null,
          mousePosition: 'bottom',
          position: 'left',
        }),
      );

      const instance = wrapper.instance();
      instance.show({ immediate: true });

      expect(getPosition).toHaveBeenCalledWith(
        expect.objectContaining({
          mouseCoordinates: {
            left: 50,
            top: 100,
          },
          mousePosition: 'bottom',
          position: 'left',
        }),
      );

      expect(wrapper.state()).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 50,
            top: 100,
          },
          mousePosition: 'bottom',
          position: 'right',
        }),
      );
    });

    it('should render the tooltip with the correct coordinates', () => {
      const wrapper = mountBase(
        <Tooltip content="Tooltip content">
          <div>foo</div>
        </Tooltip>,
      );

      const instance = wrapper.instance();
      instance.show({ immediate: true });
      wrapper.update();

      const tooltip = getPortalContents(wrapper);
      expect(tooltip.find('div').prop('style')).toEqual(
        expect.objectContaining({
          left: 50,
          top: 100,
        }),
      );
    });
  });
});
