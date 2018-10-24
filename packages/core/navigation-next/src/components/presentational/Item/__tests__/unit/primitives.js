//@flow
import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import { ItemPrimitive } from '../../primitives';
import type { ItemRenderComponentProps } from '../../types';

class TestComponent extends Component<ItemRenderComponentProps, {}> {
  render(props) {
    return <div> Hello Test </div>;
  }
}

describe('<ItemPrimitive/>', () => {
  it('should fetch component style', () => {
    const props = {
      isFocused: false,
      theme: {
        context: 'default',
        mode: ({
          item: jest.fn().mockReturnValue({
            default: {},
          }),
        }: any),
      },
      component: TestComponent,
    };

    const wrapper = shallow(<ItemPrimitive {...props} />);

    expect(props.theme.mode.item).toHaveBeenCalledTimes(1);
  });

  it('should render only component prop if present', () => {
    const props = {
      isFocused: false,
      theme: {
        context: 'default',
        mode: ({
          item: jest.fn().mockReturnValue({
            default: {},
          }),
        }: any),
      },
      component: TestComponent,
    };

    const wrapper = mount(<ItemPrimitive {...props} />);

    expect(wrapper.find(TestComponent).length).toBe(1);
    expect(wrapper.find('a').length).toBe(0);
  });

  it('should pass all props and innerRef as ref prop to component if present', () => {
    const props = {
      isFocused: false,
      theme: {
        context: 'default',
        mode: ({
          item: jest.fn().mockReturnValue({
            default: {},
          }),
        }: any),
      },
      component: TestComponent,
      //apparently functional components shouldn't be allowed to have innerRefs, check this later
      innerRef: undefined,
    };

    const wrapper = mount(<ItemPrimitive {...props} />);
    const componentWrapper = wrapper.find(TestComponent);

    expect(componentWrapper.props()).toEqual(expect.objectContaining(props));
    expect(componentWrapper.prop('ref')).toEqual(props.innerRef);
  });

  it('should render an anchor element if href prop is present', () => {
    const props = {
      isFocused: false,
      theme: {
        context: 'default',
        mode: ({
          item: jest.fn().mockReturnValue({
            default: {},
          }),
        }: any),
      },
      href: '<a>test</a>',
    };

    const wrapper = mount(<ItemPrimitive {...props} />);

    expect(wrapper.find('a').length).toBe(1);
  });

  it('should pass expected props to anchor if href prop is present', () => {
    const props = {
      after: undefined,
      before: undefined,
      component: undefined,
      href: '<a>test</a>',
      id: undefined,
      index: undefined,
      //apparently functional components shouldn't be allowed to have innerRefs, check this later
      innerRef: undefined,
      isSelected: false,
      onClick: () => {},
      spacing: 'default',
      styles: undefined,
      subText: undefined,
      target: undefined,
      text: 'item content',
      isFocused: false,
      theme: {
        context: 'default',
        mode: ({
          item: jest.fn().mockReturnValue({
            default: {},
          }),
        }: any),
      },
    };

    const wrapper = mount(<ItemPrimitive {...props} />);

    const anchorWrapper = wrapper.find('a');
    expect(anchorWrapper.prop('href')).toBe(props.href);
    expect(anchorWrapper.prop('onClick')).toBe(props.onClick);
    expect(anchorWrapper.prop('target')).toBe(props.target);
    expect(anchorWrapper.prop('innerRef')).toBe(props.innerRef);
    expect(anchorWrapper.prop('ref')).toBe(props.innerRef);
  });

  // it should fetch component style |done|
  // if CustomComponent is present send it in "as" prop to <ComponentSwitch/> |done|
  // if CustomComponent is present send this.props to <ComponentSwitch/> |done|

  // if href is present send it in "as" prop to <ComponentSwitch/> |done|
  // if href is present send { href, onClick, target, innerRef } to <ComponentSwitch/>

  // if onclick is present send it in "as" prop to <ComponentSwitch/>
  // if onclick is present send {onclick, innerRef} to <ComponentSwitch />
  // it should render a div if no href ,onclick or  component are provided

  // it should always render text
  // if subText is present it should render subText
  // if Before is present it should render Before with presentationProps
  // if After is present it should render After with presentationProps

  // presentationProps should have isFocused field
});
