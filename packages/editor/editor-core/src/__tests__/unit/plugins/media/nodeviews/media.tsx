import * as React from 'react';
import { mount } from 'enzyme';
import { CardDimensions } from '@atlaskit/media-card';
import { EditorView } from 'prosemirror-view';
import { media } from '@atlaskit/editor-test-helpers';
import { ProviderFactory, defaultSchema } from '@atlaskit/editor-common';
import UIMedia from '../../../../../plugins/media/ui/Media';
import Media from '../../../../../plugins/media/nodeviews/media';
import {
  MediaPluginState,
  stateKey as mediaStateKey,
} from '../../../../../plugins/media/pm-plugins/main';

describe('nodeviews/media', () => {
  const providerFactory = {} as ProviderFactory;
  const mediaNode = media({
    id: 'foo',
    type: 'file',
    collection: 'collection',
    width: 100,
    height: 100,
  });

  beforeEach(() => {
    const pluginState = {} as MediaPluginState;
    jest.spyOn(mediaStateKey, 'getState').mockImplementation(() => pluginState);
    providerFactory.subscribe = jest.fn();
    providerFactory.unsubscribe = jest.fn();
    pluginState.handleMediaNodeMount = jest.fn();
    pluginState.handleMediaNodeUnmount = jest.fn();
  });

  it('should render UIMedia', () => {
    const getPos = jest.fn();
    const view = {} as EditorView;
    const cardDimensions = {} as CardDimensions;
    const wrapper = mount(
      <Media
        node={mediaNode()(defaultSchema)}
        getPos={getPos}
        view={view}
        providerFactory={providerFactory}
        cardDimensions={cardDimensions}
        selected={false}
      />,
    );
    expect(wrapper.find(UIMedia).length).toBe(1);
    wrapper.unmount();
  });

  describe('props - isMediaSingle', () => {
    const getPos = jest.fn();
    const view = {} as EditorView;
    const cardDimensions = {} as CardDimensions;

    describe('when isMediaSingle is not set', () => {
      it('sets delete event handler', () => {
        const wrapper = mount(
          <Media
            node={mediaNode()(defaultSchema)}
            getPos={getPos}
            view={view}
            providerFactory={providerFactory}
            cardDimensions={cardDimensions}
            selected={true}
          />,
        );
        expect(wrapper.find(UIMedia).props().onDelete).not.toBeUndefined();
        wrapper.unmount();
      });
    });

    describe('when isMediaSingle is set to true', () => {
      it('sets delete event handler', () => {
        const wrapper = mount(
          <Media
            node={mediaNode()(defaultSchema)}
            getPos={getPos}
            view={view}
            providerFactory={providerFactory}
            cardDimensions={cardDimensions}
            selected={true}
            isMediaSingle={true}
          />,
        );
        expect(wrapper.find(UIMedia).props().onDelete).toBeUndefined();
        wrapper.unmount();
      });
    });

    describe('when isMediaSingle is set to false', () => {
      it('sets delete event handler', () => {
        const wrapper = mount(
          <Media
            node={mediaNode()(defaultSchema)}
            getPos={getPos}
            view={view}
            providerFactory={providerFactory}
            cardDimensions={cardDimensions}
            selected={true}
            isMediaSingle={false}
          />,
        );
        expect(wrapper.find(UIMedia).props().onDelete).not.toBeUndefined();
        wrapper.unmount();
      });
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
