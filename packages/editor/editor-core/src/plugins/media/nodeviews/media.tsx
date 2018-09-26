import * as React from 'react';
import { Component } from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';
import { CardDimensions, CardEventHandler } from '@atlaskit/media-card';
import { ProsemirrorGetPosHandler, ReactNodeProps } from '../../../nodeviews';
import UIMedia from '../ui/Media';
import {
  MediaPluginState,
  stateKey as mediaStateKey,
} from '../pm-plugins/main';

export interface MediaNodeProps extends ReactNodeProps {
  getPos: ProsemirrorGetPosHandler;
  view: EditorView;
  node: PMNode;
  providerFactory?: ProviderFactory;
  cardDimensions: CardDimensions;
  isMediaSingle?: boolean;
  progress?: number;
  hideProgress?: boolean;
  onExternalImageLoaded?: (
    dimensions: { width: number; height: number },
  ) => void;
}

export default class MediaNode extends Component<MediaNodeProps, {}> {
  private pluginState: MediaPluginState;

  constructor(props) {
    super(props);

    const { view } = this.props;
    this.pluginState = mediaStateKey.getState(view.state);
  }

  componentDidMount() {
    this.handleNewNode(this.props);
  }

  componentWillUnmount() {
    const { node } = this.props;
    this.pluginState.handleMediaNodeUnmount(node);
  }

  cancelProgress = () => {
    const {
      node: {
        attrs: { id },
      },
    } = this.props;
    this.pluginState.removeNodeById(id);
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
    const { fileId } = this.pluginState.getMediaNodeState(__key);
    const deleteEventHandler = isMediaSingle ? undefined : this.handleRemove;

    return (
      <UIMedia
        key={`media-node-${id}`}
        id={fileId}
        type={type!}
        collection={collection!}
        providers={providerFactory}
        cardDimensions={cardDimensions}
        onDelete={deleteEventHandler}
        selected={selected}
        url={url}
        context={context}
        onExternalImageLoaded={onExternalImageLoaded}
        disableOverlay={isMediaSingle}
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
