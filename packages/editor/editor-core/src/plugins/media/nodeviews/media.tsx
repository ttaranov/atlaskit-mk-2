import * as React from 'react';
import { Component } from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory, ImageLoaderProps } from '@atlaskit/editor-common';
import { ProsemirrorGetPosHandler, ReactNodeProps } from '../../../nodeviews';
import {
  MediaPluginState,
  stateKey as mediaStateKey,
} from '../pm-plugins/main';
import { Context, ImageResizeMode } from '@atlaskit/media-core';
import { MediaProvider } from '../pm-plugins/main';
import {
  Card,
  CardDimensions,
  CardView,
  CardEventHandler,
  CardOnClickCallback,
  Identifier,
} from '@atlaskit/media-card';

import {
  MediaType,
  MediaBaseAttributes,
  withImageLoader,
  ImageStatus,
} from '@atlaskit/editor-common';

// This is being used by DropPlaceholder now
export const MEDIA_HEIGHT = 125;
export const FILE_WIDTH = 156;

export type Appearance = 'small' | 'image' | 'horizontal' | 'square';

export interface MediaNodeProps extends ReactNodeProps {
  getPos: ProsemirrorGetPosHandler;
  view: EditorView;
  node: PMNode;
  providerFactory?: ProviderFactory;
  cardDimensions: CardDimensions;
  isMediaSingle?: boolean;
  mediaProvider?: Promise<MediaProvider>;
  onClick?: () => void;
  onExternalImageLoaded?: (
    dimensions: { width: number; height: number },
  ) => void;
}

export interface Props extends Partial<MediaBaseAttributes> {
  type: MediaType;
  mediaProvider?: Promise<MediaProvider>;
  cardDimensions?: CardDimensions;
  onClick?: CardOnClickCallback;
  onDelete?: CardEventHandler;
  resizeMode?: ImageResizeMode;
  appearance?: Appearance;
  selected?: boolean;
  url?: string;
  imageStatus?: ImageStatus;
  context: Context;
  disableOverlay?: boolean;
}

export interface MediaNodeState {
  viewContext?: Context;
}

class MediaNode extends Component<
  MediaNodeProps & ImageLoaderProps,
  MediaNodeState
> {
  private pluginState: MediaPluginState;
  private mediaProvider;

  state = {
    viewContext: undefined,
  };

  constructor(props) {
    super(props);
    const { view } = this.props;
    this.pluginState = mediaStateKey.getState(view.state);
    this.mediaProvider = props.mediaProvider;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.selected !== nextProps.selected ||
      this.state.viewContext !== nextState.viewContext ||
      this.props.node.attrs.id !== nextProps.node.attrs.id ||
      this.props.cardDimensions !== nextProps.cardDimensions
    ) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.handleNewNode(this.props);
    this.updateMediaContext();
  }

  componentWillUnmount() {
    const { node } = this.props;
    this.pluginState.handleMediaNodeUnmount(node);
  }

  private updateMediaContext = async () => {
    const mediaProvider = await this.mediaProvider;
    if (mediaProvider) {
      const viewContext = await mediaProvider.viewContext;
      if (viewContext) {
        this.setState({ viewContext });
      }
    }
  };

  render() {
    const { node, selected, cardDimensions, onClick } = this.props;
    const { id, type, collection, url, __key } = node.attrs;

    if (!this.state.viewContext) {
      return <CardView status="loading" dimensions={cardDimensions} />;
    }

    /** For new images, the media state will be loaded inside the plugin state */
    const getState = this.pluginState.getMediaNodeState(__key);
    const fileId = getState && getState.fileId ? getState.fileId : id;

    const identifier: Identifier =
      type === 'external'
        ? {
            dataURI: url!,
            name: url,
            mediaItemType: 'external-image',
          }
        : {
            id: fileId,
            mediaItemType: 'file',
            collectionName: collection!,
          };

    return (
      <Card
        context={this.state.viewContext!}
        dimensions={cardDimensions}
        identifier={identifier}
        selectable={true}
        selected={selected}
        disableOverlay={true}
        onClick={onClick}
      />
    );
  }

  private handleNewNode = (props: MediaNodeProps) => {
    const { node } = props;

    // +1 indicates the media node inside the mediaSingle nodeview
    this.pluginState.handleMediaNodeMount(node, () => this.props.getPos() + 1);
  };
}

export default withImageLoader<MediaNodeProps>(MediaNode);
