import * as React from 'react';
import { mount } from 'enzyme';
import Button from '@atlaskit/button';
import { LinkCardGenericView } from '../../src/links';
import { Details } from '../../src/links/cardGenericView/styled';
import {
  Title,
  ErrorContainer,
  SiteName,
  Thumbnail,
  ImagePlaceholderWrapper,
  TitlePlaceholder,
  DescriptionPlaceholder,
  Icon,
} from '../../src/links/cardGenericView/styled';
import { ImageViewWrapper } from '../../src/utils/mediaImage/styled';

describe('LinkCardGenericView', () => {
  const title = 'Hello world';
  const linkUrl = 'http://localhost:9001/';
  const thumbnailUrl = 'http://localhost:9001/some/thumbnail';
  const iconUrl = 'http://localhost:9001/some/icon';
  const errorMessage = 'Some random error occured';

  it('should only render the title and linkUrl when not supplied with optional props', () => {
    const card = mount(<LinkCardGenericView title={title} linkUrl={linkUrl} />);

    expect(card.find(Title).text()).toEqual(title);
    expect(card.find(SiteName).text()).toEqual(linkUrl);
    expect(card.find(Thumbnail)).toHaveLength(0);
  });

  it('should render in horizontal display mode by default', () => {
    const card = mount(
      <LinkCardGenericView
        title={title}
        linkUrl={linkUrl}
        thumbnailUrl={thumbnailUrl}
      />,
    );
    expect(card.find(Thumbnail)).toHaveLength(1);
  });

  it('should render in square display mode when specified', () => {
    const card = mount(
      <LinkCardGenericView
        title={title}
        linkUrl={linkUrl}
        thumbnailUrl={thumbnailUrl}
        appearance="square"
      />,
    );
    expect(card.find(Thumbnail)).toHaveLength(1);
  });

  it('should render a thumnail when supplied', () => {
    const card = mount(
      <LinkCardGenericView
        title={title}
        linkUrl={linkUrl}
        thumbnailUrl={thumbnailUrl}
      />,
    ) as any;

    expect(card.find(Thumbnail)).toHaveLength(1);
    expect(card.find(Thumbnail).prop('dataURI')).toEqual(thumbnailUrl);
  });

  it.skip('should NOT render a thumnail when supplied thumbnail url errors', done => {
    const card = mount(
      <LinkCardGenericView
        title={title}
        linkUrl={linkUrl}
        thumbnailUrl={thumbnailUrl}
      />,
    );

    // TODO: test fails on pipeline, find way of wait until img is loaded properly
    // Waits until the image tries to load the uri and calls the error handler which hanpens async.
    setTimeout(() => {
      expect(card.state('thumbnailError')).toBe(true);
      done();
    }, 10);
  });

  it('should render an icon when supplied', () => {
    const card = mount(
      <LinkCardGenericView title={title} linkUrl={linkUrl} iconUrl={iconUrl} />,
    );

    expect(card.find(Thumbnail)).toHaveLength(0);
    expect(card.find(Icon).prop('src')).toEqual(iconUrl);
  });

  it('should NOT render an icon when supplied icon url errors', () => {
    const card = mount(
      <LinkCardGenericView title={title} linkUrl={linkUrl} iconUrl={iconUrl} />,
    );
    card.find(Icon).simulate('error');

    expect(card.find(Thumbnail)).toHaveLength(0);
    expect(card.find(Icon)).toHaveLength(0);
  });

  it('should render the site name instead of link url inside of they <a> tag when it is supplied as a prop', () => {
    const site = 'Hello world';

    const card = mount(
      <LinkCardGenericView title={title} linkUrl={linkUrl} site={site} />,
    );
    expect(card.find(SiteName).text()).toEqual(site);
  });

  it('should render placeholder items when isLoading="true"', () => {
    const card = mount(
      <LinkCardGenericView isLoading={true} title={title} linkUrl={linkUrl} />,
    );

    expect(card.find(Thumbnail)).toHaveLength(0);
    expect(card.find(ImagePlaceholderWrapper)).toHaveLength(1);
    expect(card.find(TitlePlaceholder)).toHaveLength(1);
    expect(card.find(DescriptionPlaceholder)).toHaveLength(1);
  });

  it('displays error when error prop is passed in', () => {
    const card = mount(
      <LinkCardGenericView
        title={title}
        linkUrl={linkUrl}
        errorMessage={errorMessage}
      />,
    );

    expect(card.find(Details)).toHaveLength(0);
    expect(card.find(ErrorContainer)).toHaveLength(1);
  });

  it('Should render a retry button with a retry action', () => {
    const onRetry = () => {};
    const card = mount(
      <LinkCardGenericView
        errorMessage={errorMessage}
        onRetry={onRetry}
        title={title}
        linkUrl={linkUrl}
      />,
    );

    expect(card.find(Button).prop('onClick')).toEqual(onRetry);
  });

  it('should use "crop" sizing for link image', () => {
    const card = mount(
      <LinkCardGenericView
        title={title}
        linkUrl={linkUrl}
        thumbnailUrl={thumbnailUrl}
      />,
    );

    expect(card.find(ImageViewWrapper).prop('isCropped')).toBeTruthy();
  });
});
