// @flow
import React from 'react';
import { shallow } from 'enzyme';
import { Content } from '../../Droplist';

describe('Content', () => {
  it('renders correctly when isTall is true', () => {
    const tree = shallow(<Content isTall />);
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when isTall is false', () => {
    const tree = shallow(<Content isTall={false} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when maxHeight is 350', () => {
    const tree = shallow(<Content maxHeight={350} />);
    expect(tree).toMatchSnapshot();
  });
});
