import * as assert from 'assert';
import * as React from 'react';
import { Component } from 'react';
import styled from 'styled-components';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import {
  FilmstripView,
  Filmstrip,
  FilmstripItem,
} from '@atlaskit/media-filmstrip';
import { MediaNodeProps } from './media';
import {
  MediaPluginState,
  stateKey as mediaStateKey,
} from '../pm-plugins/main';
import { FileIdentifier } from '@atlaskit/media-card';

export interface MediaGroupNodeProps {
  view: EditorView;
  node: PMNode;
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

  /**
   * Save all childNodes ids into "mediaNodesIds"
   */
  componentDidMount() {
    this.mediaNodesIds = this.getMediaNodesIds(this.props.children);
  }

  render() {
    // const { animate, offset } = this.state;
    const items = this.getMediaNodesIds(this.props.children);
    // console.log(items)
    return (
      <Wrapper>
        <Filmstrip items={items} context={this.mediaPluginState.context} />
      </Wrapper>
    );
  }

  private getMediaNodesIds = (children: React.ReactNode): FilmstripItem[] => {
    const tempIds: string[] =
      React.Children.map(children, (child: React.ReactElement<any>) => {
        return (child.props as MediaNodeProps).node.attrs.id;
      }) || [];

    return tempIds.map(id => {
      const identifier: FileIdentifier = {
        id: this.mediaPluginState.stateManager.getState(id).fileId,
        mediaItemType: 'file',
        onClick: (e, x) => {
          console.log(e, x);
        },
      };

      return {
        identifier,
      };
    });
  };
}
