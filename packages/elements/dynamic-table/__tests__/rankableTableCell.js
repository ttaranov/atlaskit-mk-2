// @flow
import React from 'react';
import { shallow } from 'enzyme';
import { RankableTableCell } from '../src/components/rankable/TableCell';

import { head, cellWithKey as cell } from './_data';

describe('rankable/TableCell', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      cell,
      head,
      isRanking: false,
      innerRef: jest.fn(),
      refWidth: -1,
      refHeight: -1,
      isFixedSize: false,
    };
  });

  it('onKeyDown events are not propagated', () => {
    const wrapper = shallow(<RankableTableCell {...defaultProps} />);

    const stopPropagation = jest.fn();

    wrapper.simulate('keyDown', { stopPropagation });
    expect(stopPropagation).toHaveBeenCalledTimes(1);
  });
});
