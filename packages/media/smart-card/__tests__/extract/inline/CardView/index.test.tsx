import * as React from 'react';
import { shallow } from 'enzyme';
import Lozenge from '@atlaskit/lozenge';
import { CardView } from '../../../../src/inline/CardView/index';
import { A, Text, Img } from '../../../../src/inline/CardView/styled';

describe('CardView', () => {
  it('should render anchor', () => {
    const link = { href: 'some-href', title: 'some-anchor-title' };
    const element = shallow(<CardView link={link} text="some text content" />);

    expect(element.find(A)).toHaveLength(1);
    expect(element.find(A).prop('href')).toEqual('some-href');
    expect(element.find(A).prop('title')).toEqual('some-anchor-title');
  });

  it('should render text', () => {
    const link = { href: 'some-href', title: 'some-anchor-title' };
    const element = shallow(<CardView link={link} text="some text content" />);
    expect(element.find(Text).props().children).toEqual('some text content');
  });

  it('should render icon when it is provided', () => {
    const link = { href: 'some-href', title: 'some-anchor-title' };
    const icon = { url: 'some-link-to-icon', tooltip: 'some-icon-tooltip' };
    const element = shallow(
      <CardView link={link} text="some text content" icon={icon} />,
    );

    expect(element.find(Img)).toHaveLength(1);
    expect(element.find(Img).props().src).toEqual(icon.url);
    expect(element.find(Img).props().alt).toEqual(icon.tooltip);
  });

  it('should render lozenge when it is provided', () => {
    const link = { href: 'some-href', title: 'some-anchor-title' };
    const lozenge = {
      text: 'some-lozenge-text',
      isBold: true,
      appearance: 'inprogress' as 'inprogress',
    };

    const element = shallow(
      <CardView link={link} text="some text content" lozenge={lozenge} />,
    );
    expect(element.find(Lozenge)).toHaveLength(1);
    expect(element.find(Lozenge).prop('children')).toEqual('some-lozenge-text');
    expect(element.find(Lozenge).prop('appearance')).toEqual('inprogress');
    expect(element.find(Lozenge).prop('isBold')).toEqual(true);
  });
});
