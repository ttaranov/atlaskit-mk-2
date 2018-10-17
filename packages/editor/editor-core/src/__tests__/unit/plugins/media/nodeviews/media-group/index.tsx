import * as React from 'react';
import { mount } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import { mediaGroup, media } from '@atlaskit/editor-test-helpers';
import { defaultSchema } from '@atlaskit/editor-common';
import {
  MediaPluginState,
  stateKey as mediaStateKey,
  DefaultMediaStateManager,
} from '../../../../../../plugins/media/pm-plugins/main';
import MediaGroup from '../../../../../../plugins/media/nodeviews/mediaGroup';

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
  beforeEach(() => {
    pluginState = {} as MediaPluginState;
    pluginState.stateManager = stateManager;
    pluginState.getMediaOptions = () => ({});
    pluginState.getMediaNodeState = () => ({});
    pluginState.mediaGroupNodes = {};
    pluginState.handleMediaNodeRemoval = () => {};
    jest.spyOn(mediaStateKey, 'getState').mockImplementation(() => pluginState);
  });

  it('should re-render for custom media picker with no thumb', () => {
    pluginState.getMediaOptions = () => ({ customMediaPicker: {} });

    const mediaGroupNode = mediaGroup(mediaNode);
    const props = {
      view: view,
      node: mediaGroupNode(defaultSchema),
      getPos: () => 1,
      selected: null,
    };

    const wrapper = mount(<MediaGroup {...props} />);

    expect(wrapper.length).toEqual(1);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
