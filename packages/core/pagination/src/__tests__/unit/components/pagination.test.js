//@flow
import React from 'react';
import { mount } from 'enzyme';
import Link from '../../../components/link';
import { name } from '../../../../package.json';
import Pagination from '../../../components/pagination';
import { LeftNavigator, RightNavigator } from '../../../components/navigators';

describe(`${name} - pagination`, () => {
  it('does not throw if chidren are not passed', () => {
    expect(() => {
      mount(<Pagination />);
    }).not.toThrow();
  });
  it('should call the child function with the proper parameters', () => {
    const childPropSpy = jest.fn().mockReturnValue(null);
    mount(<Pagination>{childPropSpy}</Pagination>);
    expect(childPropSpy).toHaveBeenCalledWith(
      LeftNavigator,
      Link,
      RightNavigator,
    );
  });
});
