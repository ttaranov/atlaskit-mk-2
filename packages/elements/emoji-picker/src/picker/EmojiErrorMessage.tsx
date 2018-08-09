import * as React from 'react';
import { PureComponent } from 'react';
import ErrorIcon from '@atlaskit/icon/glyph/error';

export interface Props {
  message: string;
  className: string;
}

export default class EmojiErrorMessage extends PureComponent<Props, {}> {
  render() {
    return (
      <div className={this.props.className}>
        <ErrorIcon label="Error" size="small" /> {this.props.message}
      </div>
    );
  }
}
