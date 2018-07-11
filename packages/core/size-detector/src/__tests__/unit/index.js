// @flow
import React from 'react';
import { mount } from 'enzyme';
import SizeDetector from '../..';
import { name } from '../../../package.json';

describe(name, () => {
  const createChildWithSpy = spy => args => spy(args);

  beforeAll(() => {
    requestAnimationFrame.reset();
  });

  afterEach(() => {
    requestAnimationFrame.reset();
  });

  it('should pass width and height to child function', () => {
    const spy = jest.fn();
    mount(<SizeDetector>{createChildWithSpy(spy)}</SizeDetector>);
    requestAnimationFrame.step();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ height: 0, width: 0 });
  });

  it('should use requestAnimationFrame to queue resize measurements', () => {
    const spy = jest.fn();
    mount(<SizeDetector>{createChildWithSpy(spy)}</SizeDetector>);
    expect(spy).not.toHaveBeenCalled();
    requestAnimationFrame.step();
    expect(spy).toHaveBeenCalled();
  });

  it('should call cancelAnimationFrame when unmounted', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <SizeDetector>{createChildWithSpy(spy)}</SizeDetector>,
    );
    // initial frame is queued
    expect(spy).not.toHaveBeenCalled();
    wrapper.unmount();
    requestAnimationFrame.flush();
    expect(spy).not.toHaveBeenCalled();
  });

  // NOTE: enzyme doesn't fully mock object.contentDocument, so we cannot simulate
  // a resize event in the normal way. Triggering the called function is the alternative.
  it('should pass updated size measurements to the child function on resize after an animationFrame', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <SizeDetector>{createChildWithSpy(spy)}</SizeDetector>,
    );
    requestAnimationFrame.step();
    expect(spy).toHaveBeenCalledTimes(1);
    wrapper.instance().handleResize();
    requestAnimationFrame.step();
    expect(spy).toHaveBeenCalledTimes(2);
    wrapper.instance().handleResize();
    requestAnimationFrame.step();
    expect(spy).toHaveBeenCalledTimes(3);
  });

  // NOTE: Enzyme does not seem to support offsetWidth/offsetHeight on elements, so we cannot
  // reliably simulate detection of width/height changes for now. Suggestions welcome!
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should call the child function with updated width and height on resize', () => {});
});
