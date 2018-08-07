import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { mediaSingle, media } from '@atlaskit/editor-test-helpers';
import { defaultSchema, ProviderFactory } from '@atlaskit/editor-common';
import {
  MediaPluginState,
  stateKey as mediaStateKey,
  DefaultMediaStateManager,
} from '../../../../../src/plugins/media/pm-plugins/main';
import { MediaSingleNode as MediaSingle } from '../../../../../src/plugins/media/nodeviews/media-single';
import { stateKey as nodeViewStateKey } from '../../../../../src/plugins/base/pm-plugins/react-nodeview';

interface MediaProps {
  node: PMNode;
}

class Media extends React.Component<MediaProps, {}> {
  render() {
    return null;
  }
}

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
  const mockProps = {
    providerFactory: {} as ProviderFactory,
    getPos: () => 0,
  };

  beforeEach(() => {
    pluginState = {} as MediaPluginState;
    pluginState.stateManager = stateManager;
    pluginState.handleMediaNodeMount = () => {};
    jest.spyOn(mediaStateKey, 'getState').mockImplementation(() => pluginState);
    jest.spyOn(nodeViewStateKey, 'getState').mockImplementation(() => {
      return {
        subscribe: () => {},
        unsubscribe: () => {},
      };
    });
  });

  it('sets child to isMediaSingle to be true', () => {
    const view = { state: {} } as EditorView;
    const mediaSingleNode = mediaSingle({ layout: 'wrap-right' })(mediaNode);

    const wrapper = shallow(
      <MediaSingle
        {...mockProps}
        view={view}
        node={mediaSingleNode(defaultSchema)}
        width={680}
      >
        <Media node={mediaNode(defaultSchema)} />
      </MediaSingle>,
    );

    const child = wrapper.childAt(0);
    expect(child && child.props().isMediaSingle).toBe(true);
  });

  it('notifies plugin if node layout is updated', () => {
    const view = { state: {} } as EditorView;
    const mediaSingleNode = mediaSingle({ layout: 'wrap-right' })(mediaNode);
    const updatedMediaSingleNode = mediaSingle({ layout: 'center' })(mediaNode)(
      defaultSchema,
    );

    const updateLayoutSpy = jest.fn();
    pluginState.updateLayout = updateLayoutSpy;

    const wrapper = mount(
      <MediaSingle
        {...mockProps}
        view={view}
        node={mediaSingleNode(defaultSchema)}
        width={680}
      >
        <Media node={mediaNode(defaultSchema)} />
      </MediaSingle>,
    );

    wrapper.setProps({ node: updatedMediaSingleNode });

    expect(updateLayoutSpy).toHaveBeenCalledWith('center');
  });

  it('sets "onExternalImageLoaded" for external images', () => {
    const view = { state: {} } as EditorView;
    const mediaSingleNode = mediaSingle()(externalMediaNode);

    const wrapper = shallow(
      <MediaSingle
        {...mockProps}
        view={view}
        node={mediaSingleNode(defaultSchema)}
        width={680}
      >
        <Media node={externalMediaNode(defaultSchema)} />
      </MediaSingle>,
    );

    const child = wrapper.childAt(0);
    expect(child && child.props().onExternalImageLoaded).toBeDefined();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
