import * as React from 'react';
import { shallow } from 'enzyme';
import { TitleWrapper } from '../../../src/inline/IconAndTitleLayout/styled';

describe('Title', () => {
  test('it should have selected styles', () => {
    const element = shallow(<TitleWrapper isSelected={true} />);
    expect(element).toMatchSnapshot();
  });

  test('it should not have selected styles', () => {
    const element = shallow(<TitleWrapper />);
    expect(element).toMatchSnapshot();
  });
});
