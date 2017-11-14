import * as React from 'react';
import { shallow } from 'enzyme';
import Heading from '../../../../src/renderer/react/nodes/heading';

describe('<Heading />', () => {
  const heading1 = shallow(<Heading level={1}>This is a Heading 1</Heading>);
  const heading2 = shallow(<Heading level={2}>This is a Heading 2</Heading>);
  const heading3 = shallow(<Heading level={3}>This is a Heading 3</Heading>);
  const heading4 = shallow(<Heading level={4}>This is a Heading 4</Heading>);
  const heading5 = shallow(<Heading level={5}>This is a Heading 5</Heading>);
  const heading6 = shallow(<Heading level={6}>This is a Heading 6</Heading>);

  it('should wrap content with <h1>-tag', () => {
    expect(heading1.name()).toEqual('h1');
  });

  it('should wrap content with <h2>-tag', () => {
    expect(heading2.name()).toEqual('h2');
  });

  it('should wrap content with <h3>-tag', () => {
    expect(heading3.name()).toEqual('h3');
  });

  it('should wrap content with <h4>-tag', () => {
    expect(heading4.name()).toEqual('h4');
  });

  it('should wrap content with <h5>-tag', () => {
    expect(heading5.name()).toEqual('h5');
  });

  it('should wrap content with <h6>-tag', () => {
    expect(heading6.name()).toEqual('h6');
  });
});
