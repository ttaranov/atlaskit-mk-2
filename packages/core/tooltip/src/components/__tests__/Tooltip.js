// @flow

import React from 'react';
import { shallow, mount } from 'enzyme';
import 'jest-styled-components';
import Tooltip, { marshal } from '../Tooltip';
import getPosition from '../utils/getPosition';

jest.mock('../utils/getPosition', () => {
  return jest.fn(() => ({
    coordinates: {
      left: 50,
      top: 100,
    },
    mousePosition: 'bottom',
    position: 'bottom',
  }));
});
jest.useFakeTimers();

function getPortalChildren(portalWrapper) {
  // Layer Manager's portal renders its content after a setTimeout
  jest.runAllTimers();
  const instance = portalWrapper.instance();
  // portalChildRef is a raw DOM node. In enzyme 2 we could wrap this with ReactWrapper and
  // use enzyme functions on it as per https://github.com/airbnb/enzyme/issues/252#issuecomment-266125422.
  // Enzyme 3 breaks this functionality though so we can only test raw DOM attributes - https://github.com/airbnb/enzyme/issues/1202
  const portalChildRef = instance && instance.gatewayOrPortalChildRef;

  return portalChildRef && portalChildRef.props
    ? portalChildRef.props.children
    : undefined;
}

function mountBase(element) {
  return mount(shallow(element).get(0));
}

describe('Tooltip', () => {
  beforeEach(() => {
    // $FlowFixMe - mocked import
    getPosition.mockClear();
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
      const wrapper = mountBase(
        <Tooltip content="Tooltip content">
          <div>foo</div>
        </Tooltip>,
      );

      const instance = wrapper.instance();
      instance.show({ immediate: true });
      wrapper.update();

      const portalContents = getPortalChildren(wrapper.children().childAt(1));
      expect(portalContents).toBe('Tooltip content');
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
    });
  });
});
