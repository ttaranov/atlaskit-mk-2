// @flow
import React from 'react';
import { mount } from 'enzyme';
import SizeDetector from '../src';
import { name } from '../package.json';

describe(name, () => {
  let rafStub;
  let cafStub;
  const createChildWithSpy = spy => args => spy(args);
  const noOp = () => <div />;

  beforeEach(() => {
    rafStub = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(handler => handler());
    cafStub = jest.spyOn(window, 'cancelAnimationFrame');
  });

  afterEach(() => {
    rafStub.mockReset();
    rafStub.mockRestore();
    cafStub.mockReset();
    cafStub.mockRestore();
  });

  it('should pass width and height to child function', () => {
    const spy = jest.fn();
    mount(<SizeDetector>{createChildWithSpy(spy)}</SizeDetector>);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ height: 0, width: 0 });
  });

  it('should use requestAnimationFrame to queue resize measurements', () => {
    mount(<SizeDetector>{noOp}</SizeDetector>);
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
  });

  it('should call cancelAnimationFrame when unmounted', () => {
    const wrapper = mount(<SizeDetector>{noOp}</SizeDetector>);
    wrapper.unmount();
    expect(window.cancelAnimationFrame).toHaveBeenCalledTimes(1);
  });

  // NOTE: enzyme doesn't fully mock object.contentDocument, so we cannot simulate
  // a resize event in the normal way. Triggering the called function is the alternative.
  it('should pass updated size measurements to the child function on resize', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <SizeDetector>{createChildWithSpy(spy)}</SizeDetector>,
    );
    expect(spy).toHaveBeenCalledTimes(1);
    wrapper.instance().handleResize();
    expect(spy).toHaveBeenCalledTimes(2);
    wrapper.instance().handleResize();
    expect(spy).toHaveBeenCalledTimes(3);
  });

  // NOTE: Enzyme does not seem to support offsetWidth/offsetHeight on elements, so we cannot
  // reliably simulate detection of width/height changes for now. Suggestions welcome!
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should call the child function with updated width and height on resize', () => {});
});
