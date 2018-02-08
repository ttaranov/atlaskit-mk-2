import * as React from 'react';
import { shallow } from 'enzyme';
import { ImageViewWrapper } from '../../src/utils/mediaImage/styled';

describe('MediaImage styled', () => {
  it('default props', () => {
    const element = shallow(<ImageViewWrapper />);
    expect(element).toMatchSnapshot();
  });

  it('shouldCrop=true', () => {
    const element = shallow(<ImageViewWrapper shouldCrop={true} />);
    expect(element).toMatchSnapshot();
  });

  it('shouldFadeIn=true', () => {
    const element = shallow(<ImageViewWrapper shouldFadeIn={true} />);
    expect(element).toMatchSnapshot();
  });
});
