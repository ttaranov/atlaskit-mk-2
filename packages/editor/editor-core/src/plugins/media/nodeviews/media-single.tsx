import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { MediaSingle } from '@atlaskit/editor-common';
import { MediaNodeProps } from './media';
import { stateKey, MediaPluginState } from '../pm-plugins/main';
import ResizableMediaSingle from '../ui/ResizableMediaSingle';
import { displayGrid } from '../../../plugins/grid';
import { MediaSingleLayout } from '@atlaskit/editor-common';
import { EditorAppearance } from '../../../types';
import { findParentNodeOfTypeClosestToPos } from 'prosemirror-utils';

export interface MediaSingleNodeProps {
  node: PMNode;
  view: EditorView;
  containerWidth: number;
  isResizable?: boolean;
  getPos: () => number | undefined;
  lineLength: number;
  appearance: EditorAppearance;
}

export interface MediaSingleNodeState {
  progress: number;
  width?: number;
  height?: number;
}

export default class MediaSingleNode extends Component<
  MediaSingleNodeProps,
  MediaSingleNodeState
> {
  private child: ReactElement<MediaNodeProps>;
  private mediaPluginState: MediaPluginState;

  state: MediaSingleNodeState = {
    progress: 0,
  };

  constructor(props) {
    super(props);
    this.child = this.getChild(props);
    this.mediaPluginState = stateKey.getState(
      this.props.view.state,
    ) as MediaPluginState;
  }

  componentWillReceiveProps(props) {
    this.child = this.getChild(props);
  }

  componentDidMount() {
    const { __key } = this.child.props.node.attrs;
    this.mediaPluginState.stateManager.on(__key, this.handleMediaUpdate);
  }

  componentWillUnmount() {
    const { __key } = this.child.props.node.attrs;
    this.mediaPluginState.stateManager.off(__key, this.handleMediaUpdate);
  }

  componentDidUpdate() {
    const { layout } = this.props.node.attrs;
    this.mediaPluginState.updateLayout(layout);
  }

  shouldComponentUpdate(nextProps: MediaSingleNodeProps, nextState) {
    const nextChild: ReactElement<MediaNodeProps> = this.getChild(nextProps);

    const { width } = this.child.props.node.attrs;
    const { width: nextWidth } = nextChild.props.node.attrs;

    const { node } = this.props;
    const { layout } = node.attrs;
    return (
      layout === 'wide' ||
      layout === 'full-width' ||
      this.state.progress !== nextState.progress ||
      node !== nextProps.node ||
      width !== nextWidth ||
      this.props.node.attrs.width !== nextProps.node.attrs.width ||
      this.props.node.attrs.layout !== nextProps.node.attrs.layout ||
      this.props.containerWidth !== nextProps.containerWidth
    );
  }

  handleMediaUpdate = state => {
    this.setState({
      progress: state.progress || 0,
    });
  };

  getChild = props => {
    return React.Children.only(React.Children.toArray(props.children)[0]);
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
  mediaReady(mediaState) {
    return mediaState && mediaState.status === 'ready' && mediaState!.preview;
  }

  updateSize = (width: number | null, layout: MediaSingleLayout) => {
    const { state, dispatch } = this.props.view;
    const pos = this.props.getPos();
    if (typeof pos === 'undefined') {
      return;
    }

    return dispatch(
      state.tr.setNodeMarkup(pos, undefined, {
        ...this.props.node.attrs,
        layout,
        width,
      }),
    );
  };

  displayGrid = show => {
    const { layout } = this.props.node.attrs;
    displayGrid(
      show,
      layout === 'wrap-left' || layout === 'wrap-right' ? 'wrapped' : 'full',
    )(this.props.view.state, this.props.view.dispatch);
  };

  render() {
    const { layout, width: mediaSingleWidth } = this.props.node.attrs;
    const { progress } = this.state;
    let hideProgress = false;

    let { width, height, type } = this.child.props.node.attrs;

    if (type === 'external') {
      const { width: stateWidth, height: stateHeight } = this.state;

      if (width === null) {
        width = stateWidth;
      }

      if (height === null) {
        height = stateHeight;
      }
    }

    const mediaState = this.mediaPluginState.getMediaNodeState(
      this.child.props.node.attrs.__key,
    );

    if (width === null && this.mediaReady(mediaState)) {
      hideProgress = true;
    }

    const children = React.cloneElement(
      this.child as ReactElement<any>,
      {
        cardDimensions: {
          width: '100%',
          height: '100%',
        },
        hideProgress,
        isMediaSingle: true,
        progress,
        onExternalImageLoaded: this.onExternalImageLoaded,
      } as MediaNodeProps,
    );

    const props = {
      layout,
      width,
      height,

      isLoading: !width,

      containerWidth: this.props.containerWidth,
      lineLength: this.props.lineLength,
      pctWidth: mediaSingleWidth,
    };

    let canResize = true;
    const pos = this.props.getPos();
    if (pos) {
      const $pos = this.props.view.state.doc.resolve(pos);
      const { table, layoutSection } = this.props.view.state.schema.nodes;
      const disabledNode = !!findParentNodeOfTypeClosestToPos($pos, [
        table,
        layoutSection,
      ]);
      canResize = !!this.props.isResizable && !disabledNode;
    }

    return canResize ? (
      <ResizableMediaSingle
        {...props}
        getPos={this.props.getPos}
        state={this.props.view.state}
        updateSize={this.updateSize}
        displayGrid={this.displayGrid}
        gridSize={12}
        appearance={this.props.appearance}
      >
        {children}
      </ResizableMediaSingle>
    ) : (
      <MediaSingle {...props}>{children}</MediaSingle>
    );
  }
}
