import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { imageFileId, youtubeLinkId } from '@atlaskit/media-test-helpers';
import Media from '../../../../../src/renderer/react/nodes/media';
import { storyMediaProviderFactory } from '../../../../../src/test-helper';
import MediaGroup from '../../../../../src/renderer/react/nodes/mediaGroup';
import { CardView } from '@atlaskit/media-card';
import { FilmstripView } from '@atlaskit/media-filmstrip';
import { EventHandlers } from '../../../../../src/ui/Renderer';
import ProviderFactory from '../../../../../src/providerFactory';

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
      </MediaGroup>
    );
    expect(mediaGroup.find(FilmstripView).length).to.equal(1);
  });

  it('should call onClick with all the items in a media group', async () => {
    const onClick = sinon.spy();
    const eventHandlers: EventHandlers = {
      media: {
        onClick: onClick
      }
    };
    const mediaGroup = mount(
      <MediaGroup>
        <Media
          id={imageFileId.id}
          type={imageFileId.mediaItemType}
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
      { attachTo: fixture }
    );
    expect(mediaGroup.find(FilmstripView).length).to.equal(1);

    const provider = await mediaProvider;
    await provider.viewContext;

    const card = mediaGroup.find(FilmstripView).find(Media).first().find(CardView);
    card.simulate('click');

    expect(onClick.callCount).to.equal(1);
    expect(onClick.lastCall.args.length).to.be.greaterThan(1);

    const items = onClick.lastCall.args[1].list;
    expect(items.length).to.equal(2);
    expect(items[0]).to.deep.equal(imageFileId.id);
    expect(items[1]).to.deep.equal(youtubeLinkId.id);
    mediaGroup.unmount();
  });
});
