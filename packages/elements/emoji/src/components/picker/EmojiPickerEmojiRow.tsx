import * as React from 'react';
import { PureComponent } from 'react';

import * as styles from './styles';
import { EmojiDescription, OnEmojiEvent } from '../../types';
import CachingEmoji from '../common/CachingEmoji';

export interface Props {
  emojis: EmojiDescription[];
  onSelected?: OnEmojiEvent;
  onMouseMove?: OnEmojiEvent;
}

export default class EmojiPickerEmojiRow extends PureComponent<Props, {}> {
  render() {
    const { emojis, onSelected, onMouseMove } = this.props;

    return (
      <div className={styles.emojiPickerRow}>
        {emojis.map(emoji => {
          const { shortName, category, id } = emoji;
          const key = id ? `${id}-${category}` : `${shortName}-${category}`;

          return (
            <span className={styles.emojiItem} key={key}>
              <CachingEmoji
                emoji={emoji}
                selectOnHover={true}
                onSelected={onSelected}
                onMouseMove={onMouseMove}
                placeholderSize={24}
              />
            </span>
          );
        })}
      </div>
    );
  }
}
