import * as React from 'react';
import { shallow } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { mediaGroup, media } from '@atlaskit/editor-test-helpers';
import { defaultSchema, ProviderFactory } from '@atlaskit/editor-common';
import {
  MediaPluginState,
  stateKey as mediaStateKey,
  DefaultMediaStateManager,
} from '../../../../../src/plugins/media/pm-plugins/main';
import { MediaGroupNode as MediaGroup } from '../../../../../src/plugins/media/nodeviews/media-group';
import { stateKey as nodeViewStateKey } from '../../../../../src/plugins/base/pm-plugins/react-nodeview';

interface MediaProps {
  node: PMNode;
}

class Media extends React.Component<MediaProps, {}> {
  render() {
    return null;
  }
}

describe('nodeviews/mediaGroup', () => {
  let pluginState;
  const stateManager = new DefaultMediaStateManager();
  const mediaNode = media({
    id: 'foo',
    type: 'file',
    collection: 'collection',
    __key: '12345',
  })();
  const view = {} as EditorView;
  const mockProps = {
    providerFactory: {} as ProviderFactory,
    getPos: () => 0,
  };
  beforeEach(() => {
    pluginState = {} as MediaPluginState;
    pluginState.stateManager = stateManager;
    pluginState.getMediaOptions = () => ({});
    pluginState.getMediaNodeState = () => ({});
    jest.spyOn(mediaStateKey, 'getState').mockImplementation(() => pluginState);
    jest.spyOn(nodeViewStateKey, 'getState').mockImplementation(() => {
      return {
        subscribe: () => {},
        unsubscribe: () => {},
      };
    });
  });

  it('should re-render when offset changes', () => {
    const mediaGroupNode = mediaGroup(mediaNode);
    const props = {
      view: view,
      node: mediaGroupNode(defaultSchema),
    };

    const wrapper = shallow(
      <MediaGroup {...mockProps} {...props}>
        <Media node={mediaNode(defaultSchema)} />
      </MediaGroup>,
    );
    const spy = jest.spyOn(wrapper.instance(), 'render');
    wrapper.setState({ offset: 10 });
    wrapper.setState({ offset: 15 });
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should not re-render when offset is the same', () => {
    const mediaGroupNode = mediaGroup(mediaNode);
    const props = {
      view: view,
      node: mediaGroupNode(defaultSchema),
    };

    const wrapper = shallow(
      <MediaGroup {...mockProps} {...props}>
        <Media node={mediaNode(defaultSchema)} />
      </MediaGroup>,
    );

    wrapper.setState({ offset: 10 });
    const spy = jest.spyOn(wrapper.instance(), 'render');
    wrapper.setState({ offset: 10 });
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should re-render for custom media picker with no thumb', () => {
    pluginState.getMediaOptions = () => ({ customMediaPicker: {} });

    const mediaGroupNode = mediaGroup(mediaNode);
    const props = {
      view: view,
      node: mediaGroupNode(defaultSchema),
    };

    const wrapper = shallow(
      <MediaGroup {...mockProps} {...props}>
        <Media node={mediaNode(defaultSchema)} />
      </MediaGroup>,
    );

    wrapper.setState({ offset: 10 });
    const spy = jest.spyOn(wrapper.instance(), 'render');
    wrapper.setState({ offset: 10 });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
