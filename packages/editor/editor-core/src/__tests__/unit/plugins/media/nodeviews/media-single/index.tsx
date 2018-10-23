import * as React from 'react';
import { mount } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import {
  mediaSingle,
  media,
  randomId,
  storyMediaProviderFactory,
} from '@atlaskit/editor-test-helpers';
import { defaultSchema } from '@atlaskit/editor-common';
import {
  stateKey as mediaStateKey,
  DefaultMediaStateManager,
} from '../../../../../../plugins/media/pm-plugins/main';
import MediaSingle from '../../../../../../plugins/media/nodeviews/mediaSingle';
import Media from '../../../../../../plugins/media/nodeviews/media';
import { ProviderFactory } from '@atlaskit/editor-common';

const stateManager = new DefaultMediaStateManager();
const testCollectionName = `media-plugin-mock-collection-${randomId()}`;

const getFreshMediaProvider = () =>
  storyMediaProviderFactory({
    collectionName: testCollectionName,
    stateManager,

    includeUserAuthProvider: true,
  });

describe('nodeviews/mediaSingle', () => {
  let pluginState;
  const stateManager = new DefaultMediaStateManager();
  const mediaNode = media({
    id: 'foo',
    type: 'file',
    collection: 'collection',
  })();
  const externalMediaNode = media({
    type: 'external',
    url: 'http://image.jpg',
  })();

  beforeEach(() => {
    const mediaProvider = getFreshMediaProvider();
    const providerFactory = ProviderFactory.create({ mediaProvider });
    pluginState = {
      getMediaNodeStateStatus: (id: string) => 'ready',
      getMediaNodeState: (id: string) => {
        return { state: 'ready' };
      },
      options: {
        allowResizing: false,
        providerFactory: providerFactory,
      },
      handleMediaNodeMount: () => {},
    };

    pluginState.stateManager = stateManager;

    jest.spyOn(mediaStateKey, 'getState').mockImplementation(() => pluginState);
  });

  it('notifies plugin if node layout is updated', () => {
    const getPos = jest.fn();
    const view = {} as EditorView;
    const mediaSingleNode = mediaSingle({ layout: 'wrap-right' })(mediaNode);
    const updatedMediaSingleNode = mediaSingle({ layout: 'center' })(mediaNode)(
      defaultSchema,
    );

    const updateLayoutSpy = jest.fn();
    pluginState.updateLayout = updateLayoutSpy;

    const wrapper = mount(
      <MediaSingle
        view={view}
        node={mediaSingleNode(defaultSchema)}
        lineLength={680}
        getPos={getPos}
        width={123}
        selected={() => 1}
      />,
    );

    wrapper.setProps({ node: updatedMediaSingleNode });

    expect(updateLayoutSpy).toHaveBeenCalledWith('center');
  });

  it('sets "onExternalImageLoaded" for external images', () => {
    const getPos = jest.fn();
    const view = {} as EditorView;
    const mediaSingleNode = mediaSingle()(externalMediaNode);

    const wrapper = mount(
      <MediaSingle
        view={view}
        node={mediaSingleNode(defaultSchema)}
        lineLength={680}
        getPos={getPos}
        width={123}
        selected={() => 1}
      />,
    );

    expect(wrapper.find(Media).props().onExternalImageLoaded).toBeDefined();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
