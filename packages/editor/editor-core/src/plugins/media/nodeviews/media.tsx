import * as React from 'react';
import { Component } from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';
import { CardDimensions, CardEventHandler } from '@atlaskit/media-card';
import { ProsemirrorGetPosHandler, ReactNodeProps } from '../../../nodeviews';
import {
  MediaPluginState,
  stateKey as mediaStateKey,
} from '../pm-plugins/main';
import {
  Card,
  CardProps,
  CardView,
  CardDimensions,
  CardEventHandler,
  CardAction,
  CardOnClickCallback,
  Identifier,
} from '@atlaskit/media-card';

export interface MediaNodeProps extends ReactNodeProps {
  getPos: ProsemirrorGetPosHandler;
  view: EditorView;
  node: PMNode;
  providerFactory?: ProviderFactory;
  cardDimensions: CardDimensions;
  isMediaSingle?: boolean;
  onClick?: () => void;
  onExternalImageLoaded?: (
    dimensions: { width: number; height: number },
  ) => void;
}

export default class MediaNode extends Component<MediaNodeProps, {}> {
  private pluginState: MediaPluginState;

  state = {
    viewContext: undefined,
  };

  constructor(props) {
    super(props);

    const { view } = this.props;
    this.pluginState = mediaStateKey.getState(view.state);
    this.mediaProvider = this.pluginState.options.providerFactory.providers.get(
      'mediaProvider',
    );
  }

  componentDidMount() {
    this.handleNewNode(this.props);
    this.updateContext();
  }

  componentWillUnmount() {
    const { node } = this.props;
    this.pluginState.handleMediaNodeUnmount(node);
  }

  private updateContext = async () => {
    const mediaProvider = await this.mediaProvider;
    if (mediaProvider) {
      const mediaContext = await mediaProvider.viewContext;
      if (mediaContext) {
        this.setState({ viewContext: mediaContext });
      }
    }
  };

  render() {
    const {
      node,
      providerFactory,
      selected,
      cardDimensions,
      isMediaSingle,
      onExternalImageLoaded,
      context,
      onClick,
    } = this.props;
    const { id, type, collection, url, __key } = node.attrs;

    const { fileId = id } = this.pluginState.getMediaNodeState(__key);

    const deleteEventHandler = isMediaSingle ? undefined : this.handleRemove;

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

    return !this.state.viewContext ? (
      <CardView status="loading" dimensions={cardDimensions} />
    ) : (
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

  private handleRemove: CardEventHandler = (item, event) => {
    const { getPos, node } = this.props;
    this.pluginState.handleMediaNodeRemoval(node, getPos);
    if (event) {
      event.stopPropagation();
    }
  };

  private handleNewNode = (props: MediaNodeProps) => {
    const { node } = props;
    this.pluginState.handleMediaNodeMount(node, () => this.props.getPos() + 1);
  };
}
