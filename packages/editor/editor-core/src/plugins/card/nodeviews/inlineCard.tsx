import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { Card } from '@atlaskit/smart-card';

export interface Props {
  children?: React.ReactNode;
  node: PMNode;
}

export default class InlineCardNode extends React.PureComponent<Props, {}> {
  render() {
    const { node } = this.props;
    const { url, data } = node.attrs;

    return <Card url={url} data={data} appearance="inline" />;
  }
}
