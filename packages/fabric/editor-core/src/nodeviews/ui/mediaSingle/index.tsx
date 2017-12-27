import * as React from 'react';
import { PureComponent, ReactElement } from 'react';
import { Node as PMNode } from 'prosemirror-model';

import { Wrapper } from './styled';
import { MediaNodeProps } from '../media';
import { Props as MediaProps } from '../../../ui/Media/MediaComponent';

export interface MediaSingleNodeProps {
  node: PMNode;
}

export default class MediaSingleNode extends PureComponent<
  MediaSingleNodeProps
> {
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
            appearance: 'image',
          } as MediaProps,
        )}
      </Wrapper>
    );
  }
}
