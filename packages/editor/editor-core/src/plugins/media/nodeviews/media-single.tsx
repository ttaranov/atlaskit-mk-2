import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { MediaSingle, MediaBase } from '@atlaskit/editor-common';
import { MediaNodeProps } from './media';
import { stateKey, MediaPluginState } from '../pm-plugins/main';
import styled from 'styled-components';
// import MediaBase from './MediaBase';
// import { MediaSingle } from '@atlaskit/editor-common';
const DEFAULT_WIDTH = 250;
const DEFAULT_HEIGHT = 200;

export interface MediaSingleNodeProps {
  node: PMNode;
  view: EditorView;
  width: number;
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

  shouldComponentUpdate(nextProps, nextState) {
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
      width !== nextWidth
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

  render() {
    const { layout } = this.props.node.attrs;
    const { progress } = this.state;

    let { width, height, type } = this.child.props.node.attrs;

    if (type === 'external') {
      const { width: stateWidth, height: stateHeight } = this.state;

      if (width === null) {
        width = stateWidth || DEFAULT_WIDTH;
      }

      if (height === null) {
        height = stateHeight || DEFAULT_HEIGHT;
      }
    } else {
      if (height === null || width === null) {
        const Wrapper = styled.div`
          // .random > div {
          // margin-left: 0% !important;
          // transform: translateX(0%) !important;

          // }
          // [layout='full-width']

          // margin-left: 0% !important;
          // transform: translateX(0%) !important;
        `;

        console.log(this.child);
        return (
          // @ts-ignore
          // <div layout="not-full-width">
          <MediaBase widthExists={false}>
            {/* <Wrapper> */}

            {React.cloneElement(
              this.child as ReactElement<any>,
              {
                progress,
                onExternalImageLoaded: this.onExternalImageLoaded,
              } as MediaNodeProps,
            )}
            {/* </Wrapper> */}
          </MediaBase>
          //  </div>
        );
      }
    }

    return (
      <MediaSingle
        layout={layout}
        width={width}
        height={height}
        containerWidth={this.props.width}
        isLoading={!width}
      >
        {React.cloneElement(
          this.child as ReactElement<any>,
          {
            cardDimensions: {
              width: '100%',
              height: '100%',
            },
            isMediaSingle: true,
            progress,
            onExternalImageLoaded: this.onExternalImageLoaded,
          } as MediaNodeProps,
        )}
      </MediaSingle>
    );
  }
}
