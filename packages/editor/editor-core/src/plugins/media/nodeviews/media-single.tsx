import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { MediaSingle } from '@atlaskit/editor-common';
import { MediaNodeProps } from './media';
import { stateKey, MediaPluginState } from '../pm-plugins/main';

export interface MediaSingleNodeProps {
  node: PMNode;
  view: EditorView;
  width: number;
}

export default class MediaSingleNode extends Component<MediaSingleNodeProps> {
  componentDidUpdate() {
    const mediaPluginState: MediaPluginState = stateKey.getState(
      this.props.view.state,
    ) as MediaPluginState;
    const { layout } = this.props.node.attrs;
    mediaPluginState.updateLayout(layout);
  }

  shouldComponentUpdate(nextProps) {
    const { node } = this.props;
    const { layout } = node.attrs;
    return (
      layout === 'wide' || layout === 'full-width' || node !== nextProps.node
    );
  }

  render() {
    const child: ReactElement<MediaNodeProps> = React.Children.only(
      React.Children.toArray(this.props.children)[0],
    );
    const { layout } = this.props.node.attrs;
    const { width, height } = child.props.node.attrs;
    return (
      <MediaSingle
        layout={layout}
        width={width}
        height={height}
        containerWidth={this.props.width}
      >
        {React.cloneElement(
          child as ReactElement<any>,
          {
            cardDimensions: {
              width: '100%',
              height: '100%',
            },
            isMediaSingle: true,
          } as MediaNodeProps,
        )}
      </MediaSingle>
    );
  }
}
