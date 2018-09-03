import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { MediaType } from '@atlaskit/editor-common';
import { Card, CardView, CardProps } from '@atlaskit/media-card';
import {
  storyMediaProviderFactory,
  randomId,
} from '@atlaskit/editor-test-helpers';

import {
  MediaStateManager,
  DefaultMediaStateManager,
} from '../../../../../plugins/media';
import MediaComponent, {
  MediaComponentInternal,
} from '../../../../../plugins/media/ui/Media/MediaComponent';
import {
  MediaState,
  MediaStateManager as MediaStateManagerType,
} from '../../../../../plugins/media/types';

describe('@atlaskit/editor-core/ui/MediaComponent', () => {
  const file = {
    type: 'media',
    attrs: {
      type: 'file',
      id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
      collection: 'MediaServicesSample',
    },
  };

  const tempFile = {
    type: 'media',
    attrs: {
      type: 'file',
      id: 'temporary:5556346b-b081-482b-bc4a-4faca8ecd2de',
      collection: 'MediaServicesSample',
    },
  };

  const link = {
    type: 'media',
    attrs: {
      type: 'link',
      id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
      collection: 'MediaServicesSample',
    },
  };

  const external = {
    type: 'media',
    attrs: {
      type: 'external',
      url: 'http://image.jpg',
    },
  };

  const defaultStateManager = new DefaultMediaStateManager();
  const testCollectionName = `media-plugin-mock-collection-${randomId()}`;

  interface GetFreshResolvedProviderOptions {
    stateManager?: MediaStateManager;
    includeLinkCreateContext?: boolean;
  }

  const getFreshResolvedProvider = (
    {
      stateManager,
      includeLinkCreateContext,
    }: GetFreshResolvedProviderOptions = {
      stateManager: defaultStateManager,
      includeLinkCreateContext: false,
    },
  ) =>
    storyMediaProviderFactory({
      collectionName: testCollectionName,
      stateManager,
      includeLinkCreateContext,
    });

  it('should render a CardView component if the media type is file without provider', () => {
    const mediaComponent = shallow(
      <MediaComponentInternal
        id={file.attrs.id}
        type={file.attrs.type as MediaType}
        collection={file.attrs.collection}
      />,
    );
    expect(mediaComponent.find(CardView).length).toEqual(1);
  });

  it('should render a Card component if the media is a public file with provider', async () => {
    const mediaProvider = getFreshResolvedProvider();
    const mediaComponent = shallow(
      <MediaComponentInternal
        id={file.attrs.id}
        type={file.attrs.type as MediaType}
        collection={file.attrs.collection}
        mediaProvider={mediaProvider}
      />,
    );

    const resolvedMediaProvider = await mediaProvider;
    await resolvedMediaProvider.viewContext;
    mediaComponent.update();

    expect(mediaComponent.find(Card).length).toEqual(1);
  });

  it('should render a CardView component if the media is a temporary file with provider', async () => {
    const mediaProvider = getFreshResolvedProvider();
    const mediaComponent = shallow(
      <MediaComponentInternal
        id={tempFile.attrs.id}
        type={tempFile.attrs.type as MediaType}
        collection={tempFile.attrs.collection}
        mediaProvider={mediaProvider}
      />,
    );

    const resolvedMediaProvider = await mediaProvider;
    await resolvedMediaProvider.viewContext;

    expect(mediaComponent.find(CardView).length).toEqual(1);
  });

  it('should render nothing if media type is link without provider', async () => {
    const mediaProvider = getFreshResolvedProvider({
      includeLinkCreateContext: true,
    });
    const mediaComponent = shallow(
      <MediaComponentInternal
        id={link.attrs.id}
        type={link.attrs.type as MediaType}
        collection={link.attrs.collection}
      />,
    );

    const resolvedMediaProvider = await mediaProvider;
    const linkCreateContext = await resolvedMediaProvider.linkCreateContext;

    mediaComponent.setState({ linkCreateContext });

    expect(mediaComponent.find(Card).length).toEqual(0);
  });

  it('should render nothing if linkCreateContext not provided', async () => {
    const mediaProvider = getFreshResolvedProvider();
    const mediaComponent = shallow(
      <MediaComponentInternal
        id={link.attrs.id}
        type={link.attrs.type as MediaType}
        collection={link.attrs.collection}
        mediaProvider={mediaProvider}
      />,
    );

    await mediaProvider;

    expect(mediaComponent.find(Card).length).toEqual(0);
  });

  it('should render a Card component if media type is link with provider', async () => {
    const mediaProvider = getFreshResolvedProvider({
      includeLinkCreateContext: true,
    });
    const mediaComponent = shallow(
      <MediaComponentInternal
        id={link.attrs.id}
        type={link.attrs.type as MediaType}
        collection={link.attrs.collection}
        mediaProvider={mediaProvider}
      />,
    );

    const resolvedMediaProvider = await mediaProvider;
    const linkCreateContext = await resolvedMediaProvider.linkCreateContext;

    mediaComponent.setState({ linkCreateContext });

    expect(mediaComponent.find(Card).length).toEqual(1);
  });

  it('should render a CardView component if media type is external', async () => {
    const mediaComponent = shallow(
      <MediaComponentInternal
        type={external.attrs.type as MediaType}
        url={external.attrs.url}
      />,
    );

    expect(mediaComponent.find(CardView).length).toEqual(1);
  });

  /**
   * To fix ED-4030 we decided to a temporary fix. So, we not swapping `CardView` with `Card`
   * `CardView` doesn't support appearance
   */
  describe.skip('when appearance is set', () => {
    it('renders a Card component with the customized appearance', async () => {
      const mediaProvider = getFreshResolvedProvider({
        includeLinkCreateContext: true,
      });
      const mediaComponent = shallow(
        <MediaComponent
          id={link.attrs.id}
          type={link.attrs.type as MediaType}
          collection={link.attrs.collection}
          mediaProvider={mediaProvider}
          appearance="square"
        />,
      );

      const resolvedMediaProvider = await mediaProvider;
      const linkCreateContext = await resolvedMediaProvider.linkCreateContext;

      mediaComponent.setState({ linkCreateContext });

      const props: CardProps = mediaComponent.find(Card).props();
      expect(props.appearance).toEqual('square');
    });
  });

  describe.skip('when appearance is not set', () => {
    it('renders a link Card component with the default appearance', async () => {
      const mediaProvider = getFreshResolvedProvider({
        includeLinkCreateContext: true,
      });
      const mediaComponent = shallow(
        <MediaComponent
          id={link.attrs.id}
          type={link.attrs.type as MediaType}
          collection={link.attrs.collection}
          mediaProvider={mediaProvider}
        />,
      );

      const resolvedMediaProvider = await mediaProvider;
      const linkCreateContext = await resolvedMediaProvider.linkCreateContext;

      mediaComponent.setState({ linkCreateContext });

      const props: CardProps = mediaComponent.find(Card).props();
      expect(props.appearance).toEqual('horizontal');
    });
  });

  it('should use stateManager from Plugin state in Editor mode', async () => {
    const stateManager = {
      getState: () => undefined,
      newState: (): MediaState | undefined => undefined,
      updateState: () => {},
      on: jest.fn(),
      off: () => {},
      destroy: () => {},
    } as MediaStateManagerType;

    const mediaProvider = getFreshResolvedProvider({ stateManager });

    shallow(
      <MediaComponentInternal
        id={link.attrs.id}
        type={link.attrs.type as MediaType}
        collection={link.attrs.collection}
        mediaProvider={mediaProvider}
      />,
    );

    const resolvedMediaProvider = await mediaProvider;
    await resolvedMediaProvider.viewContext;

    expect(stateManager.on).toHaveBeenCalled();
  });

  it('should not raise exception if there is no linkCreateContext in mediaProvider', async () => {
    const mediaProvider = getFreshResolvedProvider();

    const media = mount(
      <MediaComponentInternal
        id={link.attrs.id}
        type={link.attrs.type as MediaType}
        collection={link.attrs.collection}
      />,
    );

    const resolvedMediaProvider = await mediaProvider;
    await (media as any).instance().handleMediaProvider(resolvedMediaProvider);
    media.unmount();
  });
});
