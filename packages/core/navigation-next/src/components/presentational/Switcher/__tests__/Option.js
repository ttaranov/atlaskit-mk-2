// @flow

import React from 'react';
import { shallow, mount } from 'enzyme';
import { components } from '@atlaskit/select';
import Option from '../Option';

describe('Option', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      innerRef: React.createRef(),
      data: {
        text: 'hello world',
      },
      innerProps: {
        'aria-selected': false,
        innerRef: React.createRef(),
        id: 'id',
        onClick: () => {},
        onMouseMove: () => {},
        onMouseOver: () => {},
        role: 'role',
        tabIndex: 0,
      },
      isFocused: false,
      isSelected: false,
      getStyles: () => {},
      theme: {},
      cx: () => {},
    };
  });

  it('should render correctly', () => {
    expect(shallow(<Option {...baseProps} />)).toMatchSnapshot();
  });

  it('should render a <components.Option />', () => {
    const wrapper = mount(<Option {...baseProps} />);
    expect(wrapper.find(components.Option)).toHaveLength(1);
  });

  it('should pass expected props to <components.Option />', () => {
    const wrapper = mount(<Option {...baseProps} />);

    expect(wrapper.find(components.Option).props()).toEqual(
      expect.objectContaining({
        getStyles: expect.any(Function),
        theme: expect.any(Object),
        cx: expect.any(Function),
      }),
    );
  });
});
