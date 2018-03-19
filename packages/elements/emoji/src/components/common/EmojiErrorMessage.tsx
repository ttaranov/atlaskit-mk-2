import * as React from 'react';
import { PureComponent } from 'react';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import * as styles from './styles';

export interface Props {
  message: string;
}

export default class EmojiPickerErrorMessage extends PureComponent<Props, {}> {
  render() {
    return (
      <div className={styles.emojiErrorMessage}>
        <ErrorIcon label="Error" size="small" /> {this.props.message}
      </div>
    );
  }
}
