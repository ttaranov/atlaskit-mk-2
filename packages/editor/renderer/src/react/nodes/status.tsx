import * as React from 'react';
import { PureComponent } from 'react';
import { Status as AkStatus } from '@atlaskit/status';

export interface Props {
  text: string;
  color: string;
  localId?: string;
}

export default class Status extends PureComponent<Props, {}> {
  render() {
    const { text, color, localId } = this.props;
    return <AkStatus text={text} color={color} localId={localId} />;
  }
}
