// @flow
import React from 'react';
import { shallow } from 'enzyme';
import { RankableTableCell } from '../../rankable/TableCell';

import { head, cellWithKey as cell } from './_data';

const createProps = () => ({
  cell,
  head,
  isRanking: false,
  innerRef: jest.fn(),
  refWidth: -1,
  refHeight: -1,
  isFixedSize: false,
});

test('onKeyDown events are not propagated', () => {
  const props = createProps();
  const wrapper = shallow(<RankableTableCell {...props} />);

  const stopPropagation = jest.fn();

  wrapper.simulate('keyDown', { stopPropagation });
  expect(stopPropagation).toHaveBeenCalledTimes(1);
});
