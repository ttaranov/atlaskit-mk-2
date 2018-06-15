import * as React from 'react';
import { shallow } from 'enzyme';
import {
  BlockErroredView,
  BlockResolvingView,
  BlockResolvedView,
} from '@atlaskit/smart-card';
import { LinkCardGenericView } from '../../../src/links/cardGenericView';

describe('LinkCardGenericView', () => {
  // const site = 'Hello world';
  // const linkUrl = 'http://localhost:9001/';
  // const thumbnailUrl = 'http://localhost:9001/some/thumbnail';
  // const iconUrl = 'http://localhost:9001/some/icon';
  const errorMessage = 'Some random error occured';

  it('should render the error view when there is an error message', () => {
    const element = shallow(
      <LinkCardGenericView errorMessage={errorMessage} />,
    );
    expect(element.find(BlockErroredView)).toHaveLength(1);
    expect(element.find(BlockResolvingView)).toHaveLength(0);
    expect(element.find(BlockResolvedView)).toHaveLength(0);
  });

  it('should render the error view when the card is loading and there is an error message', () => {
    const element = shallow(
      <LinkCardGenericView isLoading={true} errorMessage={errorMessage} />,
    );
    expect(element.find(BlockErroredView)).toHaveLength(1);
    expect(element.find(BlockResolvingView)).toHaveLength(0);
    expect(element.find(BlockResolvedView)).toHaveLength(0);
  });

  it('should render the loading view when the card is loading', () => {
    const element = shallow(<LinkCardGenericView isLoading={true} />);
    expect(element.find(BlockErroredView)).toHaveLength(0);
    expect(element.find(BlockResolvingView)).toHaveLength(1);
    expect(element.find(BlockResolvedView)).toHaveLength(0);
  });

  it('should render the loaded view when the card is loaded and there is no error message', () => {
    const element = shallow(<LinkCardGenericView />);
    expect(element.find(BlockErroredView)).toHaveLength(0);
    expect(element.find(BlockResolvingView)).toHaveLength(0);
    expect(element.find(BlockResolvedView)).toHaveLength(1);
  });

  it('should render the context text when');
  it('should render the context text when');
  it('should render the context text when');

  it('should render a title when');
  it('should not render a title when');

  it('should render a description when');
  it('should not render a description when');

  it('should render a preview when');
  it('should render a thumbnail when');
});
