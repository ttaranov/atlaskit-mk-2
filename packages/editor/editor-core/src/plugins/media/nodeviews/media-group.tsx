import * as assert from 'assert';
import * as React from 'react';
import { Component } from 'react';
import styled from 'styled-components';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

// import { FilmstripView } from '@atlaskit/media-filmstrip';
import { MediaNodeProps } from './media';
import {
  MediaPluginState,
  stateKey as mediaStateKey,
} from '../pm-plugins/main';
import MediaFallback from './MediaFallback';

export interface MediaGroupNodeProps {
  view: EditorView;
  node: PMNode;
}

export interface MediaGroupNodeState {
  animate: boolean;
  offset: number;
}

// Need `padding-left` override for media item drop-shadow
// const Wrapper = styled.div`
//   margin-bottom: 8px;
//   &&& ul {
//     padding: 0;
//   }
// `;

export default class MediaGroupNode extends Component<
  MediaGroupNodeProps,
  MediaGroupNodeState
> {
  private mediaPluginState: MediaPluginState;
  private mediaNodesIds: string[];

  state: MediaGroupNodeState = {
    animate: false,
    offset: 0,
  };

  constructor(props) {
    super(props);

    this.mediaPluginState = mediaStateKey.getState(props.view.state);
    assert(this.mediaPluginState, 'Media is not enabled');
  }

  private handleSize = ({ offset }) => this.setState({ offset });
  private handleScroll = ({ animate, offset }) =>
    this.setState({ animate, offset });

  /**
   * Save all childNodes ids into "mediaNodesIds"
   */
  componentDidMount() {
    this.mediaNodesIds = this.getMediaNodesIds(this.props.children);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const children = this.getMediaNodesIds(this.props.children);
    const nextChildren = this.getMediaNodesIds(nextProps.children);

    let tempMediaId = this.props.node.firstChild!.attrs.__key;
    const firstItemState = this.mediaPluginState.getMediaNodeState(tempMediaId);
    const hasCustomMediaPicker = !!this.mediaPluginState.getMediaOptions()
      .customMediaPicker;

    // Need this for mobile bridge. Re-render if there's no `thumbnail`
    if (hasCustomMediaPicker && firstItemState && !firstItemState.thumbnail) {
      return true;
    }

    if (
      children.length === nextChildren.length &&
      tempMediaId === nextProps.node.firstChild!.attrs.__key &&
      this.state.offset === nextState.offset
    ) {
      return false;
    }
    return true;
  }

  /**
   * Update "mediaNodesIds" and notify media plugin about removed nodes
   */
  componentWillReceiveProps(nextProps) {
    const newMediaNodesIds = this.getMediaNodesIds(nextProps.children);
    const removedNodesIds = this.mediaNodesIds.filter(
      id => newMediaNodesIds.indexOf(id) === -1,
    );

    removedNodesIds.forEach(mediaNodeId => {
      this.mediaPluginState.cancelInFlightUpload(mediaNodeId);
    });

    this.mediaNodesIds = newMediaNodesIds;
  }

  render() {
    const { animate, offset } = this.state;
    return (
      <MediaFallback
        animate={animate}
        offset={offset}
        onSize={this.handleSize}
        onScroll={this.handleScroll}
      >
        {this.props.children}
      </MediaFallback>

      // <Wrapper>
      //   <FilmstripView
      //     animate={animate}
      //     offset={offset}
      //     onSize={this.handleSize}
      //     onScroll={this.handleScroll}
      //   >
      //     {this.props.children}
      //   </FilmstripView>
      // </Wrapper>

      /*

media-group uses the fallback by deafult
\
media single uses when width or height is null
*/
    );
  }

  private getMediaNodesIds = (children: React.ReactNode): string[] => {
    return (
      React.Children.map(children, (child: React.ReactElement<any>) => {
        return (child.props as MediaNodeProps).node.attrs.id;
      }) || []
    );
  };
}
