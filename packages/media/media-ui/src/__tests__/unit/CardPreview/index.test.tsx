import * as React from 'react';
import { shallow } from 'enzyme';
import ImageLoader from 'react-render-image';
import {
  CardPreview,
  LoadingView,
  NoImageView,
  LoadedView,
} from '../../../CardPreview';

const exampleURL = 'https://placekitten.com/g/200/300';

describe('CardPreview', () => {
  it('should render the loading view when isPlaceholder=true', () => {
    const element = shallow(<CardPreview isPlaceholder={true} />);
    expect(element.find(NoImageView)).toHaveLength(0);
    expect(element.find(LoadingView)).toHaveLength(1);
    expect(element.find(LoadedView)).toHaveLength(0);
  });

  it('should render the no-image view when url is undefined', () => {
    const element = shallow(<CardPreview />);
    expect(element.find(NoImageView)).toHaveLength(1);
    expect(element.find(LoadingView)).toHaveLength(0);
    expect(element.find(LoadedView)).toHaveLength(0);
  });

  it('should render the loading view when url is an empty string', () => {
    const element = shallow(<CardPreview url="" />);
    expect(element.find(NoImageView)).toHaveLength(1);
    expect(element.find(LoadingView)).toHaveLength(0);
    expect(element.find(LoadedView)).toHaveLength(0);
  });

  it('should render the ImageLoader with all the views', () => {
    const element = shallow(<CardPreview url={exampleURL} />);
    const loader = element.find(ImageLoader);
    expect(loader.prop('loading')).toEqual(<LoadingView />);
    expect(loader.prop('loaded')).toEqual(<LoadedView url={exampleURL} />);
    expect(loader.prop('errored')).toEqual(<NoImageView />);
  });
});
