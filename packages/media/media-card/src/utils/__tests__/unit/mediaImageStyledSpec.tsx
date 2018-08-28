import * as React from 'react';
import { shallow } from 'enzyme';
import { ImageViewWrapper } from '../../mediaImage/styled';

describe('MediaImage styled', () => {
  it('default props', () => {
    const element = shallow(<ImageViewWrapper />);
    expect(element).toMatchSnapshot();
  });

  it('isCropped=true', () => {
    const element = shallow(<ImageViewWrapper isCropped={true} />);
    expect(element).toMatchSnapshot();
  });

  it('fadeIn=true', () => {
    const element = shallow(<ImageViewWrapper fadeIn={true} />);
    expect(element).toMatchSnapshot();
  });
});
