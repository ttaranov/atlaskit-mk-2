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
  providerFactory: ProviderFactory;
  cardDimensions: CardDimensions;
  isMediaSingle?: boolean;
}

const getId = (props: MediaNodeProps) => props.node.attrs.id;

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

  shouldComponentUpdate(nextProps) {
    return (
      getId(nextProps) !== getId(this.props) ||
      nextProps.selected !== this.props.selected
    );
  }

  render() {
    const {
      node,
      providerFactory,
      selected,
      view,
      cardDimensions,
      isMediaSingle,
    } = this.props;
    const { id, type, collection } = node.attrs;

    const deleteEventHandler = isMediaSingle ? undefined : this.handleRemove;

    return (
      <UIMedia
        key={`medianode-${id}`}
        editorView={view}
        id={id!}
        type={type!}
        collection={collection!}
        providers={providerFactory}
        cardDimensions={cardDimensions}
        onDelete={deleteEventHandler}
        selected={selected}
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
    const { getPos, node } = props;
    this.pluginState.handleMediaNodeMount(node, getPos);
  };
}
