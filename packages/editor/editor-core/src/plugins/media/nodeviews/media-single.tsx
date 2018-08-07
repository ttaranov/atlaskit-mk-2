import * as React from 'react';
import { Component } from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { MediaSingle, ProviderFactory } from '@atlaskit/editor-common';
import { stateKey, MediaPluginState } from '../pm-plugins/main';
import { ReactNodeView } from '../../../nodeviews';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import WithPluginState from '../../../ui/WithPluginState';
import { pluginKey as widthPluginKey } from '../../width';
import { EventDispatcher } from '../../../event-dispatcher';
import MediaNode from './media';
import { getPosHandler } from '../../../nodeviews/ReactNodeView';
import wrapComponentWithClickArea from '../ui/wrapper-click-area';
import { stateKey as nodeViewStateKey } from '../../base/pm-plugins/react-nodeview';

const DEFAULT_WIDTH = 250;
const DEFAULT_HEIGHT = 200;

export interface MediaSingleNodeProps {
  node: PMNode;
  view: EditorView;
  width: number;
  providerFactory: ProviderFactory;
  getPos: getPosHandler;
}

export interface MediaSingleNodeState {
  progress: number;
  width?: number;
  height?: number;
}

const WrappedMediaNode = wrapComponentWithClickArea(MediaNode);

export class MediaSingleNode extends Component<
  MediaSingleNodeProps,
  MediaSingleNodeState
> {
  private mediaPluginState: MediaPluginState;

  state: MediaSingleNodeState = {
    progress: 0,
  };

  constructor(props) {
    super(props);
    this.mediaPluginState = stateKey.getState(
      this.props.view.state,
    ) as MediaPluginState;
  }

  componentDidMount() {
    const { __key } = this.props.node.firstChild!.attrs;
    this.mediaPluginState.stateManager.on(__key, this.handleMediaUpdate);
  }

  componentWillUnmount() {
    const { __key } = this.props.node.firstChild!.attrs;
    this.mediaPluginState.stateManager.off(__key, this.handleMediaUpdate);
  }

  componentDidUpdate() {
    const { layout } = this.props.node.attrs;
    this.mediaPluginState.updateLayout(layout);
  }

  shouldComponentUpdate(
    nextProps: MediaSingleNodeProps,
    nextState: MediaSingleNodeState,
  ) {
    const { width } = this.props.node.firstChild!.attrs;
    const { width: nextWidth } = nextProps.node.firstChild!.attrs;

    const { node } = this.props;
    const { layout } = node.attrs;
    return (
      layout === 'wide' ||
      layout === 'full-width' ||
      this.state.progress !== nextState.progress ||
      node !== nextProps.node ||
      width !== nextWidth
    );
  }

  handleMediaUpdate = state => {
    // check for progress, otherwise we setState before initial mount
    // if (typeof state.progress !== 'undefined') {
    this.setState({
      progress: state.progress,
    });
    // }
  };

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

  render() {
    const { node } = this.props;
    if (!node.firstChild || node.firstChild.type.name !== 'media') {
      return;
    }

    const childNode = node.firstChild;
    const { layout } = this.props.node.attrs;
    const { progress } = this.state;

    let { width, height, type } = childNode.attrs;

    if (type === 'external') {
      const { width: stateWidth, height: stateHeight } = this.state;
      width = width === null ? stateWidth || DEFAULT_WIDTH : width;
      height = height === null ? stateHeight || DEFAULT_HEIGHT : height;
    }

    const {
      width: containerWidth,
      view,
      view: { state },
      providerFactory,
    } = this.props;
    const selectionPluginState = nodeViewStateKey.getState(state);

    return (
      <MediaSingle
        layout={layout}
        width={width}
        height={height}
        isLoading={!width}
        containerWidth={containerWidth}
      >
        <WrappedMediaNode
          pluginState={selectionPluginState}
          view={view}
          node={childNode}
          getPos={this.getChildPos}
          providerFactory={providerFactory}
          cardDimensions={{
            width: '100%',
            height: '100%',
          }}
          isMediaSingle={true}
          progress={progress}
          onExternalImageLoaded={this.onExternalImageLoaded}
        />
      </MediaSingle>
    );
  }

  getChildPos = () => {
    const pos = this.props.getPos();
    return typeof pos !== 'undefined' ? pos + 1 : undefined;
  };
}

export class MediaSingleView extends ReactNodeView {
  update(node, decorations) {
    return super.update(node, decorations, (currentNode, newNode) => {
      return (
        currentNode.firstChild!.attrs.__key === newNode.firstChild!.attrs.__key
      );
    });
  }

  render(props, forwardRef) {
    return (
      <WithPluginState
        editorView={this.view}
        eventDispatcher={props.eventDispatcher}
        plugins={{
          width: widthPluginKey,
        }}
        render={({ width }) => {
          return (
            <MediaSingleNode
              view={this.view}
              node={this.node}
              width={width}
              providerFactory={props.providerFactory}
              getPos={this.getPos}
            />
          );
        }}
      />
    );
  }
}

export const mediaSingleNodeView = (
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  providerFactory: ProviderFactory,
) => (node: any, view: any, getPos: getPosHandler): NodeView => {
  return new MediaSingleView(node, view, getPos, portalProviderAPI, {
    eventDispatcher,
    providerFactory,
  }).init();
};
