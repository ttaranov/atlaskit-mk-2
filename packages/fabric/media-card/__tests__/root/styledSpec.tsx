/**
 * @jest-environment node
 * @see https://github.com/styled-components/jest-styled-components#styled-components--v2
 */
import * as React from 'react';
import { shallow } from 'enzyme';
import { Wrapper } from '../../src/root/styled';
import { CardDimensions } from '../../src';

describe('Root Wrapper', () => {
  const dimensions: CardDimensions = {
    width: 400,
    height: 300,
  };

  it.skip('should render with default props', () => {
    const element = shallow(<Wrapper />);
    expect(element).toMatchSnapshot();
  });

  it('should render with square appearance', () => {
    const element = shallow(
      <Wrapper dimensions={dimensions} appearance="square" />,
    );
    expect(element).toMatchSnapshot();
  });

  it('should render with horizontal appearance', () => {
    const element = shallow(
      <Wrapper dimensions={dimensions} appearance="horizontal" />,
    );
    expect(element).toMatchSnapshot();
  });

  it.skip('should render with small appearance', () => {
    const element = shallow(
      <Wrapper dimensions={dimensions} appearance="small" />,
    );
    expect(element).toMatchSnapshot();
  });
});
