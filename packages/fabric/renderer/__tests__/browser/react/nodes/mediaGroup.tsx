import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { imageFileId, youtubeLinkId } from '@atlaskit/media-test-helpers';
import Media from '../../../../src/react/nodes/media';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers';
import MediaGroup from '../../../../src/react/nodes/mediaGroup';
import { CardView, Card } from '@atlaskit/media-card';
import { FilmstripView } from '@atlaskit/media-filmstrip';
import { EventHandlers } from '../../../../src/ui/Renderer';
import { ProviderFactory } from '@atlaskit/editor-common';

import * as sinon from 'sinon';

describe('MediaGroup', () => {
  let fixture;

  const mediaProvider = storyMediaProviderFactory();

  const providerFactory = new ProviderFactory();
  providerFactory.setProvider('mediaProvider', mediaProvider);

  beforeEach(() => {
    fixture = document.createElement('div');
    document.body.appendChild(fixture);
  });

  afterEach(() => {
    document.body.removeChild(fixture);
  });

  it('should not render a FilmstripView component if it has only one media node', () => {
    const mediaGroup = shallow(
      <MediaGroup>
        <Media
          id={imageFileId.id}
          type={imageFileId.mediaItemType}
          collection={imageFileId.collectionName}
        />
      </MediaGroup>
    );
    expect(mediaGroup.find(FilmstripView)).toHaveLength(0);
  });

  it('should render a FilmstripView component if it has more than one media node', () => {
    const mediaGroup = shallow(
      <MediaGroup>
        <Media
          id={imageFileId.id}
          type={imageFileId.mediaItemType}
          collection={imageFileId.collectionName}
        />
        <Media
          id={imageFileId.id}
          type={imageFileId.mediaItemType}
          collection={imageFileId.collectionName}
        />
      </MediaGroup>,
    );
    expect(mediaGroup.find(FilmstripView)).toHaveLength(1);
  });

  it('should call onClick with all the items in a media group', async () => {
    const onClick = sinon.spy();
    const eventHandlers: EventHandlers = {
      media: { onClick },
    };
    const mediaGroup = mount(
      <MediaGroup>
        <Media
          id={imageFileId.id}
          type={imageFileId.mediaItemType}
          occurrenceKey='001'
          collection={imageFileId.collectionName}
          eventHandlers={eventHandlers}
          providers={providerFactory}
        />
        <Media
          id={youtubeLinkId.id}
          type={youtubeLinkId.mediaItemType}
          collection={youtubeLinkId.collectionName}
          eventHandlers={eventHandlers}
          providers={providerFactory}
        />
      </MediaGroup>,
      { attachTo: fixture },
    );
    expect(mediaGroup.find(FilmstripView)).toHaveLength(1);

    const provider = await mediaProvider;
    await provider.viewContext;
    await provider.linkCreateContext;
    await provider.uploadContext;

    const card = mediaGroup
      .find(FilmstripView)
      .find(Media)
      .first()
      .find(Card);
    card.props().onClick();

    expect(onClick.callCount).toBe(1);
    expect(onClick.lastCall.args.length).toBeGreaterThan(1);

    const surroundingItems = onClick.lastCall.args[1].list;
    expect(surroundingItems.length).toBe(2);

    expect(surroundingItems[0].id).toBe(imageFileId.id);
    expect(surroundingItems[0].mediaItemType).toBe(imageFileId.mediaItemType);
    expect(surroundingItems[0].collectionName).toBe(imageFileId.collectionName);
    expect(surroundingItems[0].occurrenceKey).toBe('001');

    expect(surroundingItems[1].id).toBe(youtubeLinkId.id);
    expect(surroundingItems[1].mediaItemType).toBe(youtubeLinkId.mediaItemType);
    expect(surroundingItems[1].collectionName).toBe(youtubeLinkId.collectionName);
    expect(surroundingItems[1].occurrenceKey).toBeUndefined();

    mediaGroup.unmount();
  });
});
