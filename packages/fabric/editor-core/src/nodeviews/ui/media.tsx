import * as React from 'react';
import { PureComponent } from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { CardDimensions } from '@atlaskit/media-card';

import UIMedia from '../../ui/Media';
import ProviderFactory from '../../providerFactory';
import {
  MediaPluginState,
  stateKey as mediaStateKey,
} from '../../plugins/media';
import { ProsemirrorGetPosHandler, ReactNodeProps } from './';

export interface MediaNodeProps extends ReactNodeProps {
  getPos: ProsemirrorGetPosHandler;
  view: EditorView;
  node: PMNode;
  providerFactory: ProviderFactory;
  cardDimensions: CardDimensions;
}

const getId = (props: MediaNodeProps) => props.node.attrs.id;

export default class MediaNode extends PureComponent<MediaNodeProps, {}> {
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
    } = this.props;
    const { id, type, collection } = node.attrs;

    return (
      <UIMedia
        key={`medianode-${id}`}
        editorView={view}
        id={id!}
        type={type!}
        collection={collection!}
        providers={providerFactory}
        cardDimensions={cardDimensions}
        onDelete={this.handleRemove}
        selected={selected}
      />
    );
  }

  private handleRemove = (item?: any, event?: Event) => {
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
