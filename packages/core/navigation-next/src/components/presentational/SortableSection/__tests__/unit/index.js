// @flow

import React from 'react';
import { shallow } from 'enzyme';
import { DragDropContext } from 'react-beautiful-dnd';

import { LayoutEventEmitter } from '../../../LayoutManager/LayoutEvent';
import Section from '../../../Section';
import SortableSection from '../../index';

jest.mock('../../../LayoutManager/LayoutEvent', () => {
  const mock: any = jest.fn();
  mock.displayName = 'MockLayoutEventEmitter';
  return {
    LayoutEventEmitter: mock,
  };
});

const MockLayoutEventEmitter: any = LayoutEventEmitter;

describe('SortableSection', () => {
  let baseProps;
  let sectionChildren;
  const layoutEventEmitters = {
    emitItemDragStart: jest.fn(),
    emitItemDragEnd: jest.fn(),
  };
  beforeEach(() => {
    jest.clearAllMocks();
    MockLayoutEventEmitter.mockImplementation(({ children }) =>
      children(layoutEventEmitters),
    );
    baseProps = {
      id: 'my-section',
      onDragEnd: () => {},
    };
    sectionChildren = ({ className }: { className: string }) => (
      <div className={className}>My section</div>
    );
  });

  it('should render a Section component', () => {
    const wrapper = shallow(
      <SortableSection {...baseProps}>{sectionChildren}</SortableSection>,
    ).dive();

    const section = wrapper.find(Section);

    expect(section).toHaveLength(1);
    expect(section.props()).toEqual({
      id: 'my-section',
      alwaysShowScrollHint: false,
      shouldGrow: false,
      styles: expect.any(Function),
      children: sectionChildren,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should wrap Section with a DragDropContext Component', () => {
    const onDragUpdate = () => {};
    const wrapper = shallow(
      <SortableSection {...baseProps} onDragUpdate={onDragUpdate}>
        {sectionChildren}
      </SortableSection>,
    ).dive();

    const dragDropContext = wrapper.find(DragDropContext);
    expect(dragDropContext).toHaveLength(1);
    expect(dragDropContext.props()).toEqual({
      children: wrapper.find(Section).get(0),
      onDragStart: expect.any(Function),
      onDragUpdate,
      onDragEnd: expect.any(Function),
    });
  });

  it('should emit a drag start event and call `onDragStart` when a drag has started', () => {
    const onDragStartArgs = [{}, {}];
    const onDragStart = jest.fn();
    const wrapper = shallow(
      <SortableSection {...baseProps} onDragStart={onDragStart}>
        {sectionChildren}
      </SortableSection>,
    ).dive();

    expect(onDragStart).not.toHaveBeenCalled();
    expect(layoutEventEmitters.emitItemDragStart).not.toHaveBeenCalled();

    wrapper.find(DragDropContext).prop('onDragStart')(...onDragStartArgs);

    expect(layoutEventEmitters.emitItemDragStart).toHaveBeenCalledTimes(1);
    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(onDragStart).toHaveBeenCalledWith(...onDragStartArgs);
  });

  it('should emit a drag end event and call `onDragEnd` when a drag has ended', () => {
    const onDragEndArgs = [{}, {}];
    const onDragEnd = jest.fn();
    const wrapper = shallow(
      <SortableSection {...baseProps} onDragEnd={onDragEnd}>
        {sectionChildren}
      </SortableSection>,
    ).dive();

    expect(onDragEnd).not.toHaveBeenCalled();
    expect(layoutEventEmitters.emitItemDragEnd).not.toHaveBeenCalled();

    wrapper.find(DragDropContext).prop('onDragEnd')(...onDragEndArgs);

    expect(layoutEventEmitters.emitItemDragEnd).toHaveBeenCalledTimes(1);
    expect(onDragEnd).toHaveBeenCalledTimes(1);
    expect(onDragEnd).toHaveBeenCalledWith(...onDragEndArgs);
  });

  it('should call `onDragUpdate` when a drag has updated', () => {
    const onDragUpdateArgs = [{}, {}];
    const onDragUpdate = jest.fn();
    const wrapper = shallow(
      <SortableSection {...baseProps} onDragUpdate={onDragUpdate}>
        {sectionChildren}
      </SortableSection>,
    ).dive();

    expect(onDragUpdate).not.toHaveBeenCalled();

    wrapper.find(DragDropContext).prop('onDragUpdate')(...onDragUpdateArgs);

    expect(onDragUpdate).toHaveBeenCalledTimes(1);
    expect(onDragUpdate).toHaveBeenCalledWith(...onDragUpdateArgs);
  });
});
