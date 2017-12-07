import * as React from 'react';
import { shallow } from 'enzyme';
import CardFrame from '../../../src/shared/CardFrame';
import { Wrapper, LinkWrapper } from '../../../src/shared/CardFrame/styled';

// TODO: test placeholders

// TODO: test placeholders

describe('CardFrame', () => {
  it('should render as a link when there is a href', () => {
    const element = shallow(<CardFrame href="https://www.google.com/" />);
    expect(element.type()).toEqual(LinkWrapper);
  });

  it('should not render as a link when there is no href', () => {
    const element = shallow(<CardFrame />);
    expect(element.type()).toEqual(Wrapper);
  });
});
