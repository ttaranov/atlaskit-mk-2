import * as React from 'react';
import { shallow } from 'enzyme';
import NoImageIcon from '../NoImageIcon';
import { ImageWrapper } from '../styled';
import CardPreview from '..';

describe('CardPreview', () => {
  it('should render the no-image icon when there is an error', () => {
    const element = shallow(<CardPreview />);
    element.setState({ error: true });
    expect(element.find(NoImageIcon)).toHaveLength(1);
    expect(element.find(ImageWrapper)).toHaveLength(0);
  });

  it('should render the no-image icon when there is no url', () => {
    const element = shallow(<CardPreview />);
    expect(element.find(NoImageIcon)).toHaveLength(1);
    expect(element.find(ImageWrapper)).toHaveLength(0);
  });

  it('should render the image when there is a url', () => {
    const element = shallow(<CardPreview url="https://www.google.com" />);
    expect(element.find(NoImageIcon)).toHaveLength(0);
    expect(element.find(ImageWrapper)).toHaveLength(1);
  });
});
