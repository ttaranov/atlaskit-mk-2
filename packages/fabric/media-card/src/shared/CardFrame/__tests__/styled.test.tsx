/**
 * @jest-environment node
 * @see https://github.com/styled-components/jest-styled-components#styled-components--v2
 */
import * as React from 'react';
import { shallow } from 'enzyme';
import { Wrapper, LinkWrapper } from '../styled';

describe('Wrapper', () => {
  it('should render with minWidth when there is a minWidth', () => {
    const element = shallow(<Wrapper minWidth={100} />);
    expect(element).toHaveStyleRule('min-width', '100px');
  });

  it('should not render with minWidth when there is no minWidth', () => {
    const element = shallow(<Wrapper />);
    expect(element).not.toHaveStyleRule('min-width', '');
  });

  it('should render with minWidth when there is a minWidth', () => {
    const element = shallow(<Wrapper maxWidth={100} />);
    expect(element).toHaveStyleRule('max-width', '100px');
  });

  it('should not render with minWidth when there is no minWidth', () => {
    const element = shallow(<Wrapper />);
    expect(element).not.toHaveStyleRule('max-width', '');
  });

  it('should have hover styles when there is a href', () => {
    const element = shallow(<Wrapper href="https://www.example.com/" />);
    expect(element).toMatchSnapshot();
  });

  it('should not have hover styles when there is no href', () => {
    const element = shallow(<Wrapper />);
    expect(element).toMatchSnapshot();
  });
});

describe('LinkWrapper', () => {
  it('should render with minWidth when there is a minWidth', () => {
    const element = shallow(<LinkWrapper minWidth={100} />);
    expect(element).toHaveStyleRule('min-width', '100px');
  });

  it('should not render with minWidth when there is no minWidth', () => {
    const element = shallow(<LinkWrapper />);
    expect(element).not.toHaveStyleRule('min-width', '');
  });

  it('should render with minWidth when there is a minWidth', () => {
    const element = shallow(<LinkWrapper maxWidth={100} />);
    expect(element).toHaveStyleRule('max-width', '100px');
  });

  it('should not render with minWidth when there is no minWidth', () => {
    const element = shallow(<LinkWrapper />);
    expect(element).not.toHaveStyleRule('max-width', '');
  });

  it('should have hover styles when there is a href', () => {
    const element = shallow(<LinkWrapper href="https://www.example.com/" />);
    expect(element).toMatchSnapshot();
  });

  it('should not have hover styles when there is no href', () => {
    const element = shallow(<LinkWrapper />);
    expect(element).toMatchSnapshot();
  });
});
