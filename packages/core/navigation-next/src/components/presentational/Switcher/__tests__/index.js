// @flow

import React from 'react';
import { shallow } from 'enzyme';
import { BaseSwitcher } from '..';

describe('Switcher', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      navWidth: 240,
      options: [
        {
          avatar: 'endeavour',
          id: 'endeavour',
          pathname: '/projects/endeavour',
          text: 'Endeavour',
          subText: 'Software project',
        },
        {
          avatar: 'design-system-support',
          id: 'design-system-support',
          pathname: '/projects/design-system-support',
          text: 'Design System Support',
          subText: 'Service desk project',
        },
      ],
      target: <div> a target </div>,
    };
  });

  it('should render correctly', () => {
    expect(shallow(<BaseSwitcher {...baseProps} />)).toMatchSnapshot();
  });

  it('should have a default styles props', () => {
    const wrapper = shallow(<BaseSwitcher {...baseProps} />);
    expect(wrapper.prop('styles')).toEqual(
      expect.objectContaining({
        option: expect.any(Function),
      }),
    );
  });
});
