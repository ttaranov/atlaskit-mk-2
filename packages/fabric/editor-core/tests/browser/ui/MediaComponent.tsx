import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import {
  Context,
  ContextConfig,
  ContextFactory,
  MediaProvider,
  MediaStateManager,
  DefaultMediaStateManager,
} from '@atlaskit/media-core';
import MediaComponent from '../../../src/ui/Media/MediaComponent';
import { MediaType } from '@atlaskit/editor-common';
import {
  Card,
  CardView,
  CardProps,
} from '@atlaskit/media-card';
import {
  storyMediaProviderFactory,
  randomId,
} from '../../../src/test-helper';

describe('@atlaskit/editor-core/ui/MediaComponent', () => {
  const file = {
    type: 'media',
    attrs: {
      type: 'file',
      id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
      collection: 'MediaServicesSample'
    }
  };

  const tempFile = {
    type: 'media',
    attrs: {
      type: 'file',
      id: 'temporary:5556346b-b081-482b-bc4a-4faca8ecd2de',
      collection: 'MediaServicesSample'
    }
  };

  const link = {
    type: 'media',
    attrs: {
      type: 'link',
      id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
      collection: 'MediaServicesSample'
    }
  };

  const defaultStateManager = new DefaultMediaStateManager();
  const testCollectionName = `media-plugin-mock-collection-${randomId()}`;

  const getFreshResolvedProvider = (stateManager?: MediaStateManager) => {
    return Promise.resolve(storyMediaProviderFactory({ collectionName: testCollectionName, stateManager: stateManager || defaultStateManager })) as Promise<MediaProvider>;
  };

  it('should render a CardView component if the media type is file without provider', () => {
    const mediaComponent = shallow(
      <MediaComponent
        id={file.attrs.id}
        type={file.attrs.type as MediaType}
        collection={file.attrs.collection}
      />);
    expect(mediaComponent.find(CardView).length).to.equal(1);
  });

  it('should render a Card component if the media is a public file with provider', async () => {
    const mediaProvider = getFreshResolvedProvider();
    const mediaComponent = shallow(
      <MediaComponent
        id={file.attrs.id}
        type={file.attrs.type as MediaType}
        collection={file.attrs.collection}
        mediaProvider={mediaProvider}
      />);

    const resolvedMediaProvider = await mediaProvider;
    await resolvedMediaProvider.viewContext;

    expect(mediaComponent.find(Card).length).to.equal(1);
  });

  it('should render a CardView component if the media is a temporary file with provider', async () => {
    const mediaProvider = getFreshResolvedProvider();
    const mediaComponent = shallow(
      <MediaComponent
        id={tempFile.attrs.id}
        type={tempFile.attrs.type as MediaType}
        collection={tempFile.attrs.collection}
        mediaProvider={mediaProvider}
      />);

    const resolvedMediaProvider = await mediaProvider;
    await resolvedMediaProvider.viewContext;

    expect(mediaComponent.find(CardView).length).to.equal(1);
  });

  it('should render nothing if media type is link without provider', async () => {
    const mediaProvider = getFreshResolvedProvider();
    const mediaComponent = shallow(
      <MediaComponent
        id={link.attrs.id}
        type={link.attrs.type as MediaType}
        collection={link.attrs.collection}
      />);

    const resolvedMediaProvider = await mediaProvider;
    const resolvedLinkCreateContextConfig = await resolvedMediaProvider.linkCreateContext as ContextConfig;
    const linkCreateContext = ContextFactory.create(resolvedLinkCreateContextConfig) as Context;
    mediaComponent.setState({ 'linkCreateContext': linkCreateContext });

    expect(mediaComponent.find(Card).length).to.equal(0);
  });

  it('should render nothing if linkCreateContext not provided', async () => {
    const mediaProvider = getFreshResolvedProvider();
    const mediaComponent = shallow(
      <MediaComponent
        id={link.attrs.id}
        type={link.attrs.type as MediaType}
        collection={link.attrs.collection}
        mediaProvider={mediaProvider}
      />);

    await mediaProvider;

    expect(mediaComponent.find(Card).length).to.equal(0);
  });

  it('should render a Card component if media type is link with provider', async () => {
    const mediaProvider = getFreshResolvedProvider();
    const mediaComponent = shallow(
      <MediaComponent
        id={link.attrs.id}
        type={link.attrs.type as MediaType}
        collection={link.attrs.collection}
        mediaProvider={mediaProvider}
      />);

    const resolvedMediaProvider = await mediaProvider;
    const resolvedLinkCreateContextConfig = await resolvedMediaProvider.linkCreateContext as ContextConfig;
    const linkCreateContext = ContextFactory.create(resolvedLinkCreateContextConfig) as Context;
    mediaComponent.setState({ 'linkCreateContext': linkCreateContext });

    expect(mediaComponent.find(Card).length).to.equal(1);
  });

  context('when appearence is set', () => {
    it('renders a Card component with the customized appearence', async () => {
      const mediaProvider = getFreshResolvedProvider();
      const mediaComponent = shallow(
        <MediaComponent
          id={link.attrs.id}
          type={link.attrs.type as MediaType}
          collection={link.attrs.collection}
          mediaProvider={mediaProvider}
          appearance="square"
        />);

      const resolvedMediaProvider = await mediaProvider;
      const resolvedLinkCreateContextConfig = await resolvedMediaProvider.linkCreateContext as ContextConfig;
      const linkCreateContext = ContextFactory.create(resolvedLinkCreateContextConfig) as Context;
      mediaComponent.setState({ 'linkCreateContext': linkCreateContext });

      const props: CardProps = mediaComponent.find(Card).props();
      expect(props.appearance).to.equal('square');
    });
  });

  context('when appearence is not set', () => {
    it('renders a link Card component with the default appearence', async () => {
      const mediaProvider = getFreshResolvedProvider();
      const mediaComponent = shallow(
        <MediaComponent
          id={link.attrs.id}
          type={link.attrs.type as MediaType}
          collection={link.attrs.collection}
          mediaProvider={mediaProvider}
        />);

      const resolvedMediaProvider = await mediaProvider;
      const resolvedLinkCreateContextConfig = await resolvedMediaProvider.linkCreateContext as ContextConfig;
      const linkCreateContext = ContextFactory.create(resolvedLinkCreateContextConfig) as Context;
      mediaComponent.setState({ 'linkCreateContext': linkCreateContext });

      const props: CardProps = mediaComponent.find(Card).props();
      expect(props.appearance).to.equal('horizontal');
    });
  });

  it('should use stateManager from Plugin state in Editor mode', async () => {
    const stateManager = {
      getState: () => undefined,
      updateState: () => { },
      subscribe: () => {
        subscribeCalled = true;
      },
      unsubscribe: () => { }
    };
    const mediaProvider = getFreshResolvedProvider(stateManager);
    let subscribeCalled = false;

    shallow(
      <MediaComponent
        id={link.attrs.id}
        type={link.attrs.type as MediaType}
        collection={link.attrs.collection}
        mediaProvider={mediaProvider}
      />
    );

    const resolvedMediaProvider = await mediaProvider;
    await resolvedMediaProvider.viewContext;

    expect(subscribeCalled).to.equal(true);
  });

  it('should not raise exception if there is no linkCreateContext in mediaProvider', async () => {
    const mediaProvider = getFreshResolvedProvider();

    const media = mount(
      <MediaComponent
        id={link.attrs.id}
        type={link.attrs.type as MediaType}
        collection={link.attrs.collection}
      />
    );

    const resolvedMediaProvider = await mediaProvider;
    await (media as any).node.handleMediaProvider(resolvedMediaProvider);
    media.unmount();
  });
});
