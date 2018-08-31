import * as React from 'react';
import { shallow } from 'enzyme';
import { Wrapper, defaultWidth, defaultHeight } from '../../styled';

describe('Wrapper', () => {
  it('should have the default width and height when no width, height or aspectRatio props are passed', () => {
    const tree = shallow(<Wrapper />);
    expect(tree).toHaveStyleRule('width', `${defaultWidth}px`);
    expect(tree).toHaveStyleRule('height', `${defaultHeight}px`);
    expect(tree).toMatchSnapshot();
  });

  it('should have the passed width when the width prop is passed', () => {
    const tree = shallow(<Wrapper width={123} />);
    expect(tree).toHaveStyleRule('width', '123px');
    expect(tree).toHaveStyleRule('height', `${defaultHeight}px`);
    expect(tree).toMatchSnapshot();
  });

  it('should have the passed height when the height prop is passed', () => {
    const tree = shallow(<Wrapper height={456} />);
    expect(tree).toHaveStyleRule('width', `${defaultWidth}px`);
    expect(tree).toHaveStyleRule('height', '456px');
    expect(tree).toMatchSnapshot();
  });

  it('should have the default width and a calculated height when aspectRatio is passed', () => {
    const tree = shallow(<Wrapper aspectRatio={1.33} />);
    expect(tree).toHaveStyleRule('width', `${defaultWidth}px`);
    expect(tree).toHaveStyleRule('padding-bottom', `${1 / 1.33 * 100}%`);
    expect(tree).toMatchSnapshot();
  });
});
