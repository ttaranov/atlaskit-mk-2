import * as assert from 'assert';
import * as React from 'react';
import { Component } from 'react';
import styled from 'styled-components';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';

import { FilmstripView } from '@atlaskit/media-filmstrip';
import {
  MediaPluginState,
  stateKey as mediaStateKey,
} from '../pm-plugins/main';
import { stateKey as nodeViewStateKey } from '../../base/pm-plugins/react-nodeview';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { ReactNodeView } from '../../../nodeviews';
import MediaNode from './media';
import { getPosHandler } from '../../../nodeviews/ReactNodeView';
import wrapComponentWithClickArea from '../ui/wrapper-click-area';
import { ProviderFactory } from '@atlaskit/editor-common';

export interface MediaGroupNodeProps {
  view: EditorView;
  node: PMNode;
  providerFactory: ProviderFactory;
  getPos: getPosHandler;
}

export interface MediaGroupNodeState {
  animate: boolean;
  offset: number;
}

// Need `padding-left` override for media item drop-shadow
const Wrapper = styled.div`
  margin-bottom: 8px;
  &&& ul {
    padding: 0;
  }
`;

const WrappedMediaNode = wrapComponentWithClickArea(MediaNode);

export class MediaGroupNode extends Component<
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

  componentDidMount() {
    // Save all childNodes ids into "mediaNodesIds"
    this.mediaNodesIds = this.getMediaNodesIds(this.props.node);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let tempMediaId = this.props.node.firstChild!.attrs.__key;
    const firstItemState = this.mediaPluginState.getMediaNodeState(tempMediaId);
    const hasCustomMediaPicker = !!this.mediaPluginState.getMediaOptions()
      .customMediaPicker;

    // Need this for mobile bridge. Re-render if there's no `thumbnail`
    if (hasCustomMediaPicker && firstItemState && !firstItemState.thumbnail) {
      return true;
    }

    if (this.state.offset === nextState.offset) {
      // try to skip update if scroll offset remains the same
      if (this.props.node === nextProps.node) {
        return false;
      }
    }

    return true;
  }

  componentWillReceiveProps(nextProps: MediaGroupNodeProps) {
    // Update "mediaNodesIds" and notify media plugin about removed nodes
    const newMediaNodesIds = this.getMediaNodesIds(nextProps.node);
    const removedNodesIds = this.mediaNodesIds.filter(
      id => newMediaNodesIds.indexOf(id) === -1,
    );

    removedNodesIds.forEach(mediaNodeId => {
      this.mediaPluginState.cancelInFlightUpload(mediaNodeId);
    });

    this.mediaNodesIds = newMediaNodesIds;
  }

  private makeKey(node, offset, index) {
    return node.attrs.__key
      ? `richnode-${node.attrs.__key}`
      : node.attrs.id
        ? `richnode-${node.attrs.id}`
        : `richnode-${offset}-${index}`;
  }

  render() {
    const { animate, offset } = this.state;
    const {
      view,
      view: { state },
      providerFactory,
    } = this.props;
    const selectionPluginState = nodeViewStateKey.getState(state);

    const children: any[] = [];
    this.props.node.forEach((child, childOffset, index) => {
      children.push(
        <WrappedMediaNode
          pluginState={selectionPluginState}
          key={this.makeKey(child, childOffset, index)}
          view={view}
          node={child}
          providerFactory={providerFactory}
          getPos={this.getChildPos(childOffset)}
        />,
      );
    });

    return (
      <Wrapper>
        <FilmstripView
          animate={animate}
          offset={offset}
          onSize={this.handleSize}
          onScroll={this.handleScroll}
        >
          {children}
        </FilmstripView>
      </Wrapper>
    );
  }

  private getChildPos(offset) {
    return () => {
      const basePos = this.props.getPos();
      if (typeof basePos === 'undefined') {
        return undefined;
      }

      return basePos + 1 + offset;
    };
  }

  private getMediaNodesIds = (node: PMNode): string[] => {
    const nodeIds: string[] = [];

    node.forEach(child => {
      nodeIds.push(child.attrs.__key);
    });

    return nodeIds;
  };
}

export class MediaGroupView extends ReactNodeView {
  render(props, forwardRef) {
    return (
      <MediaGroupNode
        view={this.view}
        node={this.node}
        providerFactory={props.providerFactory}
        getPos={this.getPos}
      />
    );
  }
}

export const mediaGroupNodeView = (
  portalProviderAPI: PortalProviderAPI,
  providerFactory: ProviderFactory,
) => (node: any, view: any, getPos: getPosHandler): NodeView => {
  return new MediaGroupView(node, view, getPos, portalProviderAPI, {
    providerFactory,
  }).init();
};
