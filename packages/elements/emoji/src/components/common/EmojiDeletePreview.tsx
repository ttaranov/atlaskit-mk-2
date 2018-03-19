import * as React from 'react';
import { Component } from 'react';
import ErrorMessage from './EmojiErrorMessage';
import AkButton, { ButtonGroup } from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';

import { EmojiDescription } from '../../types';
import * as styles from './styles';
import CachingEmoji from './CachingEmoji';

export interface OnDeleteEmoji {
  (emoji: EmojiDescription): Promise<boolean>;
}

export interface Props {
  emoji: EmojiDescription;
  onDeleteEmoji: OnDeleteEmoji;
  onCloseDelete: () => void;
  errorMessage?: string;
}

export interface State {
  loading: boolean;
  error: boolean;
}

export default class EmojiDeletePreview extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: false,
    };
  }

  componentWillUpdate(nextProps) {
    if (nextProps.emoji.id !== this.props.emoji.id) {
      this.setState({ error: false });
    }
  }

  private onSubmit = async () => {
    const { emoji, onDeleteEmoji, onCloseDelete } = this.props;
    this.setState({ loading: true });
    const success = await onDeleteEmoji(emoji);
    if (success) {
      return onCloseDelete();
    }
    this.setState({
      loading: false,
      error: true,
    });
  };

  private onCancel = () => {
    this.props.onCloseDelete();
  };

  render() {
    const { emoji } = this.props;
    const { loading, error } = this.state;

    const submitButton = error ? (
      <AkButton
        className={styles.submitDelete}
        appearance="warning"
        onClick={this.onSubmit}
      >
        {loading ? <Spinner /> : <b>Retry</b>}
      </AkButton>
    ) : (
      <AkButton
        className={styles.submitDelete}
        appearance="danger"
        onClick={this.onSubmit}
      >
        {loading ? <Spinner invertColor={true} /> : <b>Remove</b>}
      </AkButton>
    );

    return (
      <div className={styles.deletePreview}>
        <div className={styles.deleteText}>
          <h5>Remove emoji</h5>
          All existing instances of this emoji will be replaced with{' '}
          {emoji.shortName}
        </div>
        <div className={styles.deleteFooter}>
          <CachingEmoji emoji={emoji} />
          {error ? <ErrorMessage message="Remove failed" /> : null}
          <ButtonGroup>
            {submitButton}
            <AkButton appearance="subtle" onClick={this.onCancel}>
              Cancel
            </AkButton>
          </ButtonGroup>
        </div>
      </div>
    );
  }
}
