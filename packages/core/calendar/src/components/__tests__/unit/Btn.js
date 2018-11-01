// @flow

import React from 'react';
import { mount } from 'enzyme';
import ArrowleftIcon from '@atlaskit/icon/glyph/chevron-left-large';
import Button from '@atlaskit/button';

import Btn from '../../Btn';

test('children', () => {
  const wrapper = mount(
    <Btn>
      <ArrowleftIcon />
    </Btn>,
  );
  const props = wrapper.find(Button).props();
  expect(props).toEqual(
    expect.objectContaining({
      appearance: 'subtle',
      spacing: 'none',
      tabIndex: -1,
      iconBefore: <ArrowleftIcon />,
    }),
  );
});

test('onClick', () => {
  const mockOnClick = jest.fn();
  const wrapper = mount(<Btn onClick={mockOnClick} />);
  wrapper.simulate('click');
  expect(mockOnClick).toHaveBeenCalledTimes(1);
});
