import * as React from 'react';
import { shallow } from 'enzyme';
import {
  CardFrame,
  CardPreview,
  LinkIcon,
  ErrorCard,
} from '@atlaskit/media-ui';
import CardDetails from '../../../../links/cardGenericView/CardDetails';
import { LinkCardGenericView } from '../../../../links/cardGenericView';

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

  it('should render the LinkIcon when isLoading=false', () => {
    const element = shallow(
      <LinkCardGenericView isLoading={false} iconUrl={iconUrl} />,
    );
    expect(element.find(CardFrame).prop('icon')).toEqual(
      <LinkIcon src={iconUrl} />,
    );
  });

  it('should render the ErrorCard when there is an errorMessage', () => {
    const element = shallow(
      <LinkCardGenericView errorMessage={errorMessage} />,
    );
    expect(element.find(ErrorCard)).toHaveLength(1);
  });

  it('should not render ErrorWrapper when there is not an errorMessage', () => {
    const element = shallow(<LinkCardGenericView />);
    expect(element.find(ErrorCard)).toHaveLength(0);
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
});
