import * as React from 'react';
import { shallow } from 'enzyme';
import { Link } from '../../../src/inline/ResolvedView/styled';

describe('Link', () => {
  test('it should have selected styles', () => {
    const element = shallow(<Link isSelected={true} />);
    expect(element).toMatchSnapshot();
  });

  test('it should not have selected styles', () => {
    const element = shallow(<Link />);
    expect(element).toMatchSnapshot();
  });
});
