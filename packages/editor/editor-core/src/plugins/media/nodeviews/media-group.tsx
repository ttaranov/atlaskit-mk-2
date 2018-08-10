import * as assert from 'assert';
import * as React from 'react';
import { Component } from 'react';
import styled from 'styled-components';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import { FilmstripView, MediaGridView } from '@atlaskit/media-filmstrip';
import { MediaNodeProps } from './media';
import {
  MediaPluginState,
  stateKey as mediaStateKey,
} from '../pm-plugins/main';
import { GridItem } from '@atlaskit/media-filmstrip';

export interface MediaGroupNodeProps {
  view: EditorView;
  node: PMNode;
}

export interface MediaGridItem {
  id: string;
  dataURI?: string;
  isLoaded?: boolean;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface MediaGroupNodeState {
  animate: boolean;
  offset: number;
  gridItems: MediaGridItem[];
}

// Need `padding-left` override for media item drop-shadow
const Wrapper = styled.div`
  margin-bottom: 8px;
  &&& ul {
    padding: 0;
  }
`;

export default class MediaGroupNode extends Component<
  MediaGroupNodeProps,
  MediaGroupNodeState
> {
  private mediaPluginState: MediaPluginState;
  private mediaNodesIds: string[];

  state: MediaGroupNodeState = {
    animate: false,
    offset: 0,
    gridItems: [],
  };

  constructor(props) {
    super(props);

    this.mediaPluginState = mediaStateKey.getState(props.view.state);
    assert(this.mediaPluginState, 'Media is not enabled');
  }

  private handleSize = ({ offset }) => this.setState({ offset });
  private handleScroll = ({ animate, offset }) =>
    this.setState({ animate, offset });

  onStateChange = state => {
    const { id, thumbnail } = state;
    if (thumbnail) {
      const gridItems = [...this.state.gridItems];
      const { src, dimensions } = thumbnail;
      const newGridItems: MediaGridItem[] = gridItems.map(item => {
        if (item.id === id) {
          return {
            id,
            dataURI: src,
            dimensions,
            isLoaded: item.isLoaded,
          };
        }

        return item;
      });

      this.setState({
        gridItems: newGridItems,
      });
    }
  };

  get shouldRenderMediaGrid(): boolean {
    const { gridItems } = this.state;
    if (gridItems.length < 2) {
      return false;
    }
    return gridItems.every(item => {
      return Boolean(item.dataURI && item.dimensions);
    });
  }
  /**
   * Save all childNodes ids into "mediaNodesIds"
   */
  componentDidMount() {
    this.mediaNodesIds = this.getMediaNodesIds(this.props.children);
    // TODO: also subscribe to new id's on "componentWillReceiveProps"
    this.mediaNodesIds.forEach(id => {
      this.mediaPluginState.stateManager.on(id, this.onStateChange);
    });

    const gridItems: MediaGridItem[] = this.mediaNodesIds.map(id => {
      return {
        id,
      };
    });

    this.setState({
      gridItems,
    });
  }

  shouldComponentUpdate(nextProps, nextState: MediaGroupNodeState) {
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
      this.state.offset === nextState.offset &&
      this.state.gridItems === nextState.gridItems
    ) {
      // TODO: fix logic and return "false"
      return true;
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

  onItemsChange = (gridItems: GridItem[]) => {
    const { gridItems: mediaGridItems } = this.state;
    const newMediaGridItems: MediaGridItem[] = gridItems.map(item => {
      const mediaGridItem = mediaGridItems.find(
        mediaGridItem =>
          mediaGridItem ? mediaGridItem.dataURI === item.dataURI : false,
      );
      const id = mediaGridItem ? mediaGridItem.id : '';

      return {
        ...item,
        id,
      };
    });

    this.setState({
      gridItems: newMediaGridItems,
    });
  };

  render() {
    const { shouldRenderMediaGrid } = this;
    const { animate, offset } = this.state;

    if (shouldRenderMediaGrid) {
      const { gridItems } = this.state;
      const items: GridItem[] = gridItems.map(gridItem => {
        return {
          dataURI: gridItem.dataURI!,
          dimensions: gridItem.dimensions!,
        };
      });

      return (
        <MediaGridView
          items={items}
          onItemsChange={this.onItemsChange}
          width={652}
        />
      );
    }

    return (
      <Wrapper>
        <FilmstripView
          animate={animate}
          offset={offset}
          onSize={this.handleSize}
          onScroll={this.handleScroll}
        >
          {this.props.children}
        </FilmstripView>
      </Wrapper>
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
