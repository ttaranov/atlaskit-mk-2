// @flow

import React from 'react';
import { shallow, mount } from 'enzyme';
import 'jest-styled-components';
import Tooltip, { marshal } from '../Tooltip';

jest.useFakeTimers();

describe('Tooltip', () => {
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

    it('should render a tooltip after show method is called', () => {
      const wrapper = mount(
        shallow(
          <Tooltip content="Tooltip content">
            <div>foo</div>
          </Tooltip>,
        ).get(0),
      );

      const instance = wrapper.instance();
      instance.show({ immediate: true });
      wrapper.update();
      jest.runAllTimers();

      const portal = wrapper.children().childAt(1);
      const portalInstance = portal.instance();
      const portalChild = portalInstance.gatewayOrPortalChildRef;

      expect(portalChild.props.children).toBe('Tooltip content');
    });
  });
});
