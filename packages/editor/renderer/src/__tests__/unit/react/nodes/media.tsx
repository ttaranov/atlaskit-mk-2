import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { MediaType } from '@atlaskit/editor-common';
import { MediaCard } from '../../../../ui/MediaCard';
import Media from '../../../../react/nodes/media';

describe('Media', () => {
  const mediaNode = {
    type: 'media',
    attrs: {
      type: 'file',
      id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
      collection: 'MediaServicesSample',
    },
  };

  it('should render a media component with the proper props', async () => {
    const mediaComponent = mount(
      <Media
        type={mediaNode.attrs.type as MediaType}
        id={mediaNode.attrs.id}
        collection={mediaNode.attrs.collection}
      />,
    );

    expect(mediaComponent.find(MediaCard).length).to.equal(1);
    mediaComponent.unmount();
  });

  it('should render a media component with external image', async () => {
    const mediaComponent = mount(
      <Media type="external" url="http://image.jpg" />,
    );

    expect(mediaComponent.find(MediaCard).length).to.equal(1);
    mediaComponent.unmount();
  });
});
