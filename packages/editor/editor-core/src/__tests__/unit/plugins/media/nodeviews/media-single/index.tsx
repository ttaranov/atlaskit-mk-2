import * as React from 'react';
import { mount, shallow } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { mediaSingle, media } from '@atlaskit/editor-test-helpers';
import { defaultSchema } from '@atlaskit/editor-common';
import {
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
  })();
  const externalMediaNode = media({
    type: 'external',
    url: 'http://image.jpg',
  })();

  beforeEach(() => {
    pluginState = {
      getMediaNodeStateStatus: (id: string) => 'ready',
      getMediaNodeState: (id: string) => {
        return { state: 'ready' };
      },
    };
    pluginState.stateManager = stateManager;
    jest.spyOn(mediaStateKey, 'getState').mockImplementation(() => pluginState);
  });

  it('sets child to isMediaSingle to be true', () => {
    const view = {} as EditorView;
    const mediaSingleNode = mediaSingle({ layout: 'wrap-right' })(mediaNode);

    const wrapper = shallow(
      <MediaSingle
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
        width={680}
      >
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
      <MediaSingle
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
