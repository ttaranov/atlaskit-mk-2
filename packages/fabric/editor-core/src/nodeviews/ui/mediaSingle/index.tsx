import * as React from 'react';
import { PureComponent } from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { Wrapper } from './styled';

export interface MediaSingleNodeProps {
  node: PMNode;
}

export default class MediaSingleNode extends PureComponent<
  MediaSingleNodeProps,
  {}
> {
  render() {
    const { node, children } = this.props;
    return <Wrapper layout={node.attrs.layout}>{children}</Wrapper>;
  }
}
