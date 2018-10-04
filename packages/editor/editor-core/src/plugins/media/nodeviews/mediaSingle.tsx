import * as React from 'react';
import { Component } from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { MediaSingle, WithProviders } from '@atlaskit/editor-common';
import { stateKey, MediaPluginState } from '../pm-plugins/main';
import ReactNodeView from '../../../nodeviews/ReactNodeView';
import MediaItem from './media';
import WithPluginState from '../../../ui/WithPluginState';
import { pluginKey as widthPluginKey } from '../../width';
import { setNodeSelection } from '../../../utils';
import { stateKey as reactNodeViewStateKey } from '../../../plugins/base/pm-plugins/react-nodeview';

const DEFAULT_WIDTH = 250;
const DEFAULT_HEIGHT = 200;

export interface MediaSingleNodeProps {
  node: PMNode;
  view: EditorView;
  width: number;
  selected: boolean;
  getPos: () => number;
}

export interface MediaSingleNodeState {
  width?: number;
  height?: number;
}

export default class MediaSingleNode extends Component<
  MediaSingleNodeProps,
  MediaSingleNodeState
> {
  private child: PMNode;
  private mediaPluginState: MediaPluginState;

  constructor(props) {
    super(props);
    this.child = props.node.firstChild;
    this.mediaPluginState = stateKey.getState(
      this.props.view.state,
    ) as MediaPluginState;
  }

  componentDidUpdate() {
    const { layout } = this.props.node.attrs;
    this.mediaPluginState.updateLayout(layout);
  }

  private onExternalImageLoaded = ({ width, height }) => {
    this.setState(
      {
        width,
        height,
      },
      () => {
        this.forceUpdate();
      },
    );
  };
  mediaReady(mediaState) {
    return mediaState && mediaState.status === 'ready' && mediaState!.preview;
  }

  selectMediaSingle = () => {
    setNodeSelection(this.props.view, this.props.getPos() + 1);
  };

  render() {
    const { layout } = this.props.node.attrs;

    const { selected } = this.props;

    let { width, height, type } = this.child.attrs;

    if (type === 'external') {
      const { width: stateWidth, height: stateHeight } = this.state;

      if (width === null) {
        width = stateWidth || DEFAULT_WIDTH;
      }

      if (height === null) {
        height = stateHeight || DEFAULT_HEIGHT;
      }
    }

    const mediaState = this.mediaPluginState.getMediaNodeState(
      this.child.attrs.__key,
    );

    if (width === null && this.mediaReady(mediaState)) {
      width = DEFAULT_WIDTH;
      height = DEFAULT_HEIGHT;
    }

    return (
      <MediaSingle
        layout={layout}
        width={width}
        height={height}
        containerWidth={this.props.width}
        isLoading={!width}
      >
        <WithProviders
          providers={['mediaProvider']}
          providerFactory={this.mediaPluginState.options.providerFactory}
          renderNode={({ mediaProvider }) => {
            return (
              <MediaItem
                node={this.child}
                view={this.props.view}
                width={width}
                getPos={this.props.getPos}
                cardDimensions={{
                  width: '100%',
                  height: '100%',
                }}
                mediaProvider={mediaProvider}
                selected={selected}
                onClick={this.selectMediaSingle}
                onExternalImageLoaded={this.onExternalImageLoaded}
              />
            );
          }}
        />
      </MediaSingle>
    );
  }
}

class MediaSingleNodeView extends ReactNodeView {
  render(props, forwardRef) {
    return (
      <WithPluginState
        editorView={this.view}
        plugins={{
          width: widthPluginKey,
          reactNodeViewState: reactNodeViewStateKey,
        }}
        render={({width, lineLength}) => {
          return (
            <MediaSingleNode
              width={width.width}
              lineLength={lineLength}
              node={this.node}
              getPos={this.getPos}
              view={this.view}
              selected={this.getPos() + 1 === width.reactNodeViewState}
            />
          );
        }}
      />
    );
  }
}

export const ReactMediaSingleNode = portalProviderAPI => (
  node: any,
  view: any,
  getPos: () => number,
): NodeView => {
  return new MediaSingleNodeView(node, view, getPos, portalProviderAPI).init();
};
