import * as React from 'react';
import { PureComponent, ReactElement } from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { Wrapper } from './styled';
import { MediaNodeProps } from '../media';
import { stateKey, MediaPluginState } from '../../../plugins/media';

export interface MediaSingleNodeProps {
  node: PMNode;
  view: EditorView;
}

export default class MediaSingleNode extends PureComponent<
  MediaSingleNodeProps
> {
  componentDidUpdate() {
    const mediaPluginState: MediaPluginState = stateKey.getState(
      this.props.view.state,
    ) as MediaPluginState;
    const { layout } = this.props.node.attrs;
    mediaPluginState.updateLayout(layout);
  }

  render() {
    const child: ReactElement<MediaNodeProps> = React.Children.only(
      React.Children.toArray(this.props.children)[0],
    );
    const { layout } = this.props.node.attrs;
    const { width, height } = child.props.node.attrs;
    return (
      <Wrapper layout={layout} height={height} width={width}>
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
      </Wrapper>
    );
  }
}
