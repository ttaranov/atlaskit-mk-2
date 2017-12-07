import * as React from 'react';
import { shallow, mount } from 'enzyme';
import Button from '@atlaskit/button';
import { __mock__ } from 'react-render-image';
import CardFrame from '../../../src/shared/CardFrame';
import CardPreview from '../../../src/shared/CardPreview';
import CardDetails from '../../../src/links/cardGenericView/CardDetails';
import {
  LinkCardGenericView,
  DefaultIcon,
  ErrorIcon,
  CustomIcon,
} from '../../../src/links/cardGenericView';
import { ErrorWrapper } from '../../../src/links/cardGenericView/styled';

describe('LinkCardGenericView', () => {
  const site = 'Hello world';
  const linkUrl = 'http://localhost:9001/';
  const thumbnailUrl = 'http://localhost:9001/some/thumbnail';
  const iconUrl = 'http://localhost:9001/some/icon';
  const errorMessage = 'Some random error occured';

  it('should render a link when a link is provided', () => {
    const element = shallow(<LinkCardGenericView linkUrl={linkUrl} />);
    expect(element.find(CardFrame).prop('href')).toEqual(linkUrl);
  });

  it('should not render a link when a link is not provided', () => {
    const element = shallow(<LinkCardGenericView />);
    expect(element.find(CardFrame).prop('href')).toBeUndefined();
  });

  it('should not render a link when there is an error message', () => {
    const element = shallow(
      <LinkCardGenericView linkUrl={linkUrl} errorMessage={errorMessage} />,
    );
    expect(element.find(CardFrame).prop('href')).toBeUndefined();
  });

  it('should have a minWidth of 400 when appearance=horizontal', () => {
    const element = shallow(<LinkCardGenericView appearance="horizontal" />);
    expect(element.find(CardFrame).prop('minWidth')).toEqual(400);
  });

  it('should have a minWidth of 272 when appearance!=horizontal', () => {
    const element = shallow(<LinkCardGenericView />);
    expect(element.find(CardFrame).prop('minWidth')).toEqual(272);
  });

  it('should have a maxWidth of 400 when appearance=horizontal', () => {
    const element = shallow(<LinkCardGenericView appearance="horizontal" />);
    expect(element.find(CardFrame).prop('maxWidth')).toEqual(400);
  });

  it('should have a maxWidth of 400 when appearance!=horizontal', () => {
    const element = shallow(<LinkCardGenericView />);
    expect(element.find(CardFrame).prop('maxWidth')).toEqual(400);
  });

  it('should not render an icon when isLoading=true', () => {
    const element = shallow(<LinkCardGenericView isLoading={true} />);
    expect(element.find(CardFrame).prop('icon')).toBeUndefined();
  });

  it('should render the default icon if there is no iconUrl', () => {
    const element = shallow(<LinkCardGenericView />);
    expect(element.find(CardFrame).prop('icon')).toEqual(<DefaultIcon />);
  });

  it('should render the error icon if there is an errorMessage', () => {
    const element = shallow(
      <LinkCardGenericView iconUrl={iconUrl} errorMessage={errorMessage} />,
    );
    expect(element.find(CardFrame).prop('icon')).toEqual(<ErrorIcon />);
  });

  it('should render the default icon if the icon is loading', () => {
    expect.assertions(1);
    __mock__({ loaded: false, errored: false });
    const element = shallow(<LinkCardGenericView iconUrl={iconUrl} />);
    const prop = element.find(CardFrame).prop('icon');
    if (prop) {
      // render the prop because the icon is wrapped in <ImageLoaded/>
      const icon = shallow(prop).getNode();
      expect(icon).toEqual(<DefaultIcon />);
    }
  });

  it('should render the custom icon if the icon is loaded', () => {
    expect.assertions(1);
    __mock__({ loaded: true, errored: false });
    const element = mount(<LinkCardGenericView iconUrl={iconUrl} />);
    const prop = element.find(CardFrame).prop('icon');
    if (prop) {
      // render the prop because the icon is wrapped in <ImageLoaded/>
      const icon = shallow(prop).getNode();
      expect(icon).toEqual(<CustomIcon url={iconUrl} alt="" />);
    }
  });

  it('should render the default icon if the icon is errored', () => {
    expect.assertions(1);
    __mock__({ loaded: false, errored: true });
    const element = shallow(<LinkCardGenericView iconUrl={iconUrl} />);
    const prop = element.find(CardFrame).prop('icon');
    if (prop) {
      // render the prop because the icon is wrapped in <ImageLoaded/>
      const icon = shallow(prop).getNode();
      expect(icon).toEqual(<DefaultIcon />);
    }
  });

  it('should render ErrorWrapper when there is an errorMessage', () => {
    const element = shallow(
      <LinkCardGenericView errorMessage={errorMessage} />,
    );
    expect(element.find(ErrorWrapper)).toHaveLength(1);
  });

  it('should not render ErrorWrapper when there is not an errorMessage', () => {
    const element = shallow(<LinkCardGenericView />);
    expect(element.find(ErrorWrapper)).toHaveLength(0);
  });

  it('should not render CardDetails when there is an errorMessage', () => {
    const element = shallow(
      <LinkCardGenericView errorMessage={errorMessage} />,
    );
    expect(element.find(CardDetails)).toHaveLength(0);
  });

  it('should render CardDetails when there is not an errorMessage', () => {
    const element = shallow(<LinkCardGenericView />);
    expect(element.find(CardDetails)).toHaveLength(1);
  });

  it('should not render CardPreview when there is an errorMessage', () => {
    const element = shallow(
      <LinkCardGenericView errorMessage={errorMessage} />,
    );
    expect(element.find(CardPreview)).toHaveLength(0);
  });

  it('should render CardPreview when there is not an errorMessage', () => {
    const element = shallow(<LinkCardGenericView />);
    expect(element.find(CardPreview)).toHaveLength(1);
  });

  it('should render the preview when isHorizontal=false', () => {
    const element = shallow(<LinkCardGenericView />);
    expect(element.find(CardPreview)).toHaveLength(1);
  });

  it('should not render the preview when isHorizontal=true', () => {
    const element = shallow(<LinkCardGenericView appearance="horizontal" />);
    expect(element.find(CardPreview)).toHaveLength(0);
  });

  it('should render the site name when the site name is provided', () => {
    const element = shallow(
      <LinkCardGenericView site={site} linkUrl={linkUrl} />,
    );
    expect(element.find(CardFrame).prop('text')).toEqual(site);
  });

  it('should render the site URL when the site name is not provided', () => {
    const element = shallow(<LinkCardGenericView linkUrl={linkUrl} />);
    expect(element.find(CardFrame).prop('text')).toEqual(linkUrl);
  });

  it('should render the thumnail when isHorizontal=true', () => {
    const element = shallow(
      <LinkCardGenericView
        appearance="horizontal"
        thumbnailUrl={thumbnailUrl}
      />,
    );
    expect(element.find(CardDetails).prop('thumbnail')).toEqual(thumbnailUrl);
  });

  it('should rnot ender the thumnail when isHorizontal=false', () => {
    const element = shallow(
      <LinkCardGenericView thumbnailUrl={thumbnailUrl} />,
    );
    expect(element.find(CardDetails).prop('thumbnail')).toBeUndefined();
  });

  it('should render a retry button with a retry action', () => {
    const onRetry = jest.fn();
    const element = mount(
      <LinkCardGenericView errorMessage={errorMessage} onRetry={onRetry} />,
    );
    expect(element.find(Button).prop('onClick')).toEqual(onRetry);
  });
});
