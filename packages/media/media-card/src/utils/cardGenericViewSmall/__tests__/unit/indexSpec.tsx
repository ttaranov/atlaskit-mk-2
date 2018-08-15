import * as React from 'react';
import { shallow } from 'enzyme';
import { MediaTypeIcon } from '../../../mediaTypeIcon';
import { CardGenericViewSmall } from '../..';
import { Retry } from '../../styled';
import { ThumbnailView } from '../../thumbnailView';
import { InfoView } from '../../infoView';

describe('CardGenericViewSmall', () => {
  it('should render thumbnail for files', () => {
    const element = shallow(
      <CardGenericViewSmall
        type="file"
        thumbnailUrl="https://www.example.com/foobar.png"
      />,
    );
    expect(element.find(ThumbnailView).props()).toMatchObject({
      type: 'file',
      url: 'https://www.example.com/foobar.png',
    });
  });

  it('should render thumbnail for links', () => {
    const element = shallow(
      <CardGenericViewSmall
        type="link"
        thumbnailUrl="https://www.example.com/foobar.png"
      />,
    );
    expect(element.find(ThumbnailView).props()).toMatchObject({
      type: 'link',
      url: 'https://www.example.com/foobar.png',
    });
  });

  it('should render info for files', () => {
    const element = shallow(
      <CardGenericViewSmall
        type="file"
        mediaType="image"
        title="foobar.png"
        subtitle="44KB"
      />,
    );
    expect(element.find(InfoView).props()).toMatchObject({
      icon: <MediaTypeIcon type="image" />,
      title: 'foobar.png',
      subtitle: '44KB',
      isLink: false,
    });
  });

  it('should render info for links', () => {
    const element = shallow(
      <CardGenericViewSmall
        type="link"
        title="foobar.png"
        subtitle="www.google.com"
      />,
    );
    expect(element.find(InfoView).props()).toMatchObject({
      title: 'foobar.png',
      subtitle: 'www.google.com',
      isLink: true,
    });
  });

  it('should allow manual retry when an error occurs', () => {
    const onRetry = jest.fn();
    const element = shallow(
      <CardGenericViewSmall type="file" error="some-error" onRetry={onRetry} />,
    );
    const retryElement = element.find(Retry);

    expect(retryElement).toHaveLength(1);
    retryElement.simulate('click');
    expect(onRetry).toHaveBeenCalled();
  });
});
