// @flow

import React from 'react';
import { shallow } from 'enzyme';
import { BaseSwitcher } from '..';
import { PopupSelect } from '@atlaskit/select';

const Target = () => 'A target';

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
      target: <Target />,
    };
  });

  it('should render correctly', () => {
    expect(shallow(<BaseSwitcher {...baseProps} />)).toMatchSnapshot();
  });

  it('should render a PopupSelect', () => {
    const wrapper = shallow(<BaseSwitcher {...baseProps} />);
    expect(wrapper.find(PopupSelect)).toHaveLength(1);
  });

  it('should pass default styles to PopupSelect', () => {
    const wrapper = shallow(<BaseSwitcher {...baseProps} />);
    const styles = wrapper.prop('styles');
    expect(styles).toEqual(
      expect.objectContaining({
        option: expect.any(Function),
      }),
    );
    expect(wrapper.find(PopupSelect).prop('styles')).toEqual(styles);
  });

  it('should pass custom styles to PopupSelect', () => {
    const customStyles = {
      option: (base, state) => ({
        ...base,
        display: 'flex',
        backgroundColor: 'green',
        color: 'green',
        paddingLeft: 16,
        marginBottom: 2,
      }),
      control: base => ({
        ...base,
        color: 'red',
      }),
    };
    const wrapper = shallow(
      <BaseSwitcher {...baseProps} styles={customStyles} />,
    );
    expect(wrapper.find(PopupSelect).prop('styles')).toEqual(customStyles);
  });
});
