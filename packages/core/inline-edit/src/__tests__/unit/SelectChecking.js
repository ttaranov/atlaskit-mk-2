// @flow
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { mount } from 'enzyme';
import FieldBaseWrapper from '../../styled/FieldBaseWrapper';
import InlineEditStateless from '../../InlineEditStateless';

const mouseEvent = (eventName, wrapper, clientX, clientY) =>
  wrapper.simulate(eventName, { clientX, clientY });

const mouseDown = mouseEvent.bind(null, 'mousedown');
const mouseClick = mouseEvent.bind(null, 'click');
const noop = () => {};

const EditView = <p>This is the edit view</p>;
const ReadView = <p>This is the read view</p>;
const props = {
  label: 'test',
  isEditing: false,
  onConfirm: noop,
  onCancel: noop,
  editView: EditView,
  readView: ReadView,
};

describe('@atlaskit/inline-edit', () => {
  it('should call onEditRequested() when mouse does not move', () => {
    const spy = jest.fn();

    const wrapper = mount(
      <InlineEditStateless {...props} onEditRequested={spy} />,
    );
    mouseDown(wrapper.find(FieldBaseWrapper), 0, 0);
    mouseClick(wrapper.find(FieldBaseWrapper), 0, 0);
    expect(spy).toHaveBeenCalled();
  });
  it('should call onEditRequested() when mouse moves slightly on the y axis', () => {
    const spy = jest.fn();

    const wrapper = mount(
      <InlineEditStateless {...props} onEditRequested={spy} />,
    );
    mouseDown(wrapper.find(FieldBaseWrapper), 0, 0);
    mouseClick(wrapper.find(FieldBaseWrapper), 0, 4);
    expect(spy).toHaveBeenCalled();
  });
  it('should call onEditRequested() when mouse moves slightly on the x axis', () => {
    const spy = jest.fn();

    const wrapper = mount(
      <InlineEditStateless {...props} onEditRequested={spy} />,
    );
    mouseDown(wrapper.find(FieldBaseWrapper), 0, 0);
    mouseClick(wrapper.find(FieldBaseWrapper), 4, 0);
    expect(spy).toHaveBeenCalled();
  });
  it('should not call onEditRequested() when mouse moves beydon threshold on the x axis', () => {
    const spy = jest.fn();

    const wrapper = mount(
      <InlineEditStateless {...props} onEditRequested={spy} />,
    );
    mouseDown(wrapper.find(FieldBaseWrapper), 0, 0);
    mouseClick(wrapper.find(FieldBaseWrapper), 5, 0);
    expect(spy).not.toHaveBeenCalled();
  });
  it('should not call onEditRequested() when mouse moves beydon threshold on the y axis', () => {
    const spy = jest.fn();

    const wrapper = mount(
      <InlineEditStateless {...props} onEditRequested={spy} />,
    );
    mouseDown(wrapper.find(FieldBaseWrapper), 0, 0);
    mouseClick(wrapper.find(FieldBaseWrapper), 0, 5);
    expect(spy).not.toHaveBeenCalled();
  });
});
