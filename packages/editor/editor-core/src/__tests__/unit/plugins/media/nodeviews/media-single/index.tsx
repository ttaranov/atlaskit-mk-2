import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { mediaSingle, media } from '@atlaskit/editor-test-helpers';
import { defaultSchema, MediaBase } from '@atlaskit/editor-common';
import {
  MediaPluginState,
  stateKey as mediaStateKey,
  DefaultMediaStateManager,
} from '../../../../../../plugins/media/pm-plugins/main';
import MediaSingle from '../../../../../../plugins/media/nodeviews/media-single';

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
    width: 680,
  })();

  const mediaNodeWithoutWidth = media({
    id: 'foo',
    type: 'file',
    collection: 'collection',
  })();

  const externalMediaNode = media({
    type: 'external',
    url: 'http://image.jpg',
  })();

  beforeEach(() => {
    pluginState = {} as MediaPluginState;
    pluginState.stateManager = stateManager;
    jest.spyOn(mediaStateKey, 'getState').mockImplementation(() => pluginState);
  });

  it('when the width or height is null inserts a mediaBase component using a filmstrip', () => {
    const view = {} as EditorView;
    const mediaSingleNode = mediaSingle({ layout: 'wrap-right' })(
      mediaNodeWithoutWidth,
    );

    const wrapper = shallow(
      <MediaSingle view={view} node={mediaSingleNode(defaultSchema)}>
        <Media node={mediaNodeWithoutWidth(defaultSchema)} />
      </MediaSingle>,
    );

    expect(wrapper.find(MediaBase).length).toEqual(1);
    expect(wrapper.find(MediaSingle).length).toEqual(0);
  });

  it('sets child to isMediaSingle to be true', () => {
    const view = {} as EditorView;
    const mediaSingleNode = mediaSingle({ layout: 'wrap-right' })(mediaNode);

    const wrapper = shallow(
      <MediaSingle view={view} node={mediaSingleNode(defaultSchema)}>
        <Media node={mediaNode(defaultSchema)} />
      </MediaSingle>,
    );

    const child = wrapper.childAt(0);
    expect(child && child.props().isMediaSingle).toBe(true);
  });

  it('notifies plugin if node layout is updated', () => {
    const view = {} as EditorView;
    const mediaSingleNode = mediaSingle({ layout: 'wrap-right' })(mediaNode);
    const updatedMediaSingleNode = mediaSingle({ layout: 'center' })(mediaNode)(
      defaultSchema,
    );

    const updateLayoutSpy = jest.fn();
    pluginState.updateLayout = updateLayoutSpy;

    const wrapper = mount(
      <MediaSingle view={view} node={mediaSingleNode(defaultSchema)}>
        <Media node={mediaNode(defaultSchema)} />
      </MediaSingle>,
    );

    wrapper.setProps({ node: updatedMediaSingleNode });

    expect(updateLayoutSpy).toHaveBeenCalledWith('center');
  });

  it('sets "onExternalImageLoaded" for external images', () => {
    const view = {} as EditorView;
    const mediaSingleNode = mediaSingle()(externalMediaNode);

    const wrapper = shallow(
      <MediaSingle view={view} node={mediaSingleNode(defaultSchema)}>
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
