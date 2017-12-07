import * as React from 'react';
import { mount } from 'enzyme';
import { __mock__ } from 'react-render-image';
import CardPreview, {
  LoadingView,
  NoImageView,
  LoadedView,
} from '../../../src/shared/CardPreview';

const exampleURL = 'https://placekitten.com/g/200/300';

describe('CardPreview', () => {
  it('should render the loading view when isPlaceholder=true', () => {
    const element = mount(<CardPreview isPlaceholder={true} />);
    expect(element.find(NoImageView)).toHaveLength(0);
    expect(element.find(LoadingView)).toHaveLength(1);
    expect(element.find(LoadedView)).toHaveLength(0);
  });

  it('should render the no-image view when url is undefined', () => {
    const element = mount(<CardPreview />);
    expect(element.find(NoImageView)).toHaveLength(1);
    expect(element.find(LoadingView)).toHaveLength(0);
    expect(element.find(LoadedView)).toHaveLength(0);
  });

  it('should render the loading view when url is an empty string', () => {
    const element = mount(<CardPreview url="" />);
    expect(element.find(NoImageView)).toHaveLength(1);
    expect(element.find(LoadingView)).toHaveLength(0);
    expect(element.find(LoadedView)).toHaveLength(0);
  });

  it('should render the loading view when the url is loading', () => {
    __mock__({ loaded: false, errored: false });
    const element = mount(<CardPreview url={exampleURL} />);
    expect(element.find(NoImageView)).toHaveLength(0);
    expect(element.find(LoadingView)).toHaveLength(1);
    expect(element.find(LoadedView)).toHaveLength(0);
  });

  it('should render the loaded view when the url is loaded', () => {
    __mock__({ loaded: true, errored: false });
    const element = mount(<CardPreview url={exampleURL} />);
    expect(element.find(NoImageView)).toHaveLength(0);
    expect(element.find(LoadingView)).toHaveLength(0);
    expect(element.find(LoadedView)).toHaveLength(1);
  });

  it('should render the no-image view when the url is errored', () => {
    __mock__({ loaded: false, errored: true });
    const element = mount(<CardPreview url={exampleURL} />);
    expect(element.find(NoImageView)).toHaveLength(1);
    expect(element.find(LoadingView)).toHaveLength(0);
    expect(element.find(LoadedView)).toHaveLength(0);
  });
});
