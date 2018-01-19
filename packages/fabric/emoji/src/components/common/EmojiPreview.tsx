import * as React from 'react';
import { PureComponent } from 'react';
import * as classNames from 'classnames';

import * as styles from './styles';
import EmojiButton from '../../components/common/EmojiButton';
import CachingEmoji from '../../components/common/CachingEmoji';
import ToneSelector from './ToneSelector';
import {
  EmojiDescription,
  EmojiDescriptionWithVariations,
  OnToneSelected,
  ToneSelection,
} from '../../types';

export interface Props {
  emoji?: EmojiDescription;
  toneEmoji?: EmojiDescriptionWithVariations;
  selectedTone?: ToneSelection;
  onToneSelected?: OnToneSelected;
}

export interface State {
  selectingTone: boolean;
}

export default class EmojiPreview extends PureComponent<Props, State> {
  state = {
    selectingTone: false,
  };

  onToneButtonClick = () => {
    this.setState({
      selectingTone: true,
    });
  };

  onToneSelected = toneValue => {
    this.setState({
      selectingTone: false,
    });

    if (this.props.onToneSelected) {
      this.props.onToneSelected(toneValue);
    }
  };

  onMouseLeave = () => {
    this.setState({
      selectingTone: false,
    });
  };

  renderTones() {
    const { toneEmoji, selectedTone } = this.props;
    if (!toneEmoji) {
      return null;
    }

    if (this.state.selectingTone) {
      return (
        <div className={styles.toneSelectorContainer}>
          <ToneSelector
            emoji={toneEmoji}
            onToneSelected={this.onToneSelected}
          />
        </div>
      );
    }

    let previewEmoji = toneEmoji;
    if (selectedTone && previewEmoji.skinVariations) {
      previewEmoji = previewEmoji.skinVariations[(selectedTone || 1) - 1];
    }

    return (
      <div className={styles.buttons}>
        <EmojiButton
          emoji={previewEmoji}
          // tslint:disable-next-line:jsx-no-lambda
          onSelected={() => this.onToneButtonClick()}
          selectOnHover={true}
        />
      </div>
    );
  }

  renderEmojiPreview() {
    const emoji = this.props.emoji;

    if (!emoji || this.state.selectingTone) {
      return null;
    }

    const previewClasses = classNames({
      [styles.preview]: true,
      [styles.withToneSelector]: !!this.props.toneEmoji,
    });

    const previewTextClasses = classNames({
      [styles.previewText]: true,
      [styles.previewSingleLine]: !emoji.name,
    });

    return (
      <div className={previewClasses}>
        <span className={styles.previewImg}>
          <CachingEmoji emoji={emoji} />
        </span>
        <div className={previewTextClasses}>
          <span className={styles.name}>{emoji.name}</span>
          <span className={styles.shortName}>{emoji.shortName}</span>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.emojiPreview} onMouseLeave={this.onMouseLeave}>
        {this.renderEmojiPreview()}
        {this.renderTones()}
      </div>
    );
  }
}
