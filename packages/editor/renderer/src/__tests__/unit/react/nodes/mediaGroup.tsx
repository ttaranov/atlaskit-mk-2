import * as React from 'react';
import { mount, shallow } from 'enzyme';
import * as sinon from 'sinon';
import { imageFileId, youtubeLinkId } from '@atlaskit/media-test-helpers';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers';
import { Card, CardEvent } from '@atlaskit/media-card';
import { FilmstripView } from '@atlaskit/media-filmstrip';
import { ProviderFactory, EventHandlers } from '@atlaskit/editor-common';
import Media from '../../../../react/nodes/media';
import MediaGroup from '../../../../react/nodes/mediaGroup';

describe('MediaGroup', () => {
  let fixture;

  const mediaProvider = storyMediaProviderFactory();

  const providerFactory = ProviderFactory.create({ mediaProvider });

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
      </MediaGroup>,
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
    const onClick = sinon.spy() as any;
    const eventHandlers = {
      media: { onClick },
    } as EventHandlers;
    const mediaGroup = mount(
      <MediaGroup eventHandlers={eventHandlers}>
        <Media
          id={imageFileId.id}
          type={imageFileId.mediaItemType}
          occurrenceKey="001"
          collection={imageFileId.collectionName}
          providers={providerFactory}
        />
        <Media
          id={youtubeLinkId.id}
          type={youtubeLinkId.mediaItemType}
          collection={youtubeLinkId.collectionName}
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
    mediaGroup.update();

    const card = mediaGroup
      .find(FilmstripView)
      .find(Media)
      .first()
      .find(Card);
    card.props().onClick!({} as CardEvent);

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
    expect(surroundingItems[1].collectionName).toBe(
      youtubeLinkId.collectionName,
    );
    expect(surroundingItems[1].occurrenceKey).toBeUndefined();

    mediaGroup.unmount();
  });
});
