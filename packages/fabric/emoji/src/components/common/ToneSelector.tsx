import * as React from 'react';
import { PureComponent } from 'react';

import {
  EmojiDescription,
  EmojiDescriptionWithVariations,
  OnToneSelected,
} from '../../types';
import EmojiButton from './EmojiButton';
import { FireAnalyticsEvent, withAnalytics } from '@atlaskit/analytics';
import { analyticsEmojiPrefix } from '../../constants';

export interface Props {
  emoji: EmojiDescriptionWithVariations;
  onToneSelected: OnToneSelected;
  firePrivateAnalyticsEvent?: FireAnalyticsEvent;
}

const extractAllTones = (
  emoji: EmojiDescriptionWithVariations,
): EmojiDescription[] => {
  if (emoji.skinVariations) {
    return [emoji, ...emoji.skinVariations];
  }
  return [emoji];
};

export class ToneSelectorInternal extends PureComponent<Props, {}> {
  private onToneSelectedHandler = (skinTone: number) => {
    const { onToneSelected, firePrivateAnalyticsEvent } = this.props;
    onToneSelected(skinTone);

    if (firePrivateAnalyticsEvent) {
      firePrivateAnalyticsEvent(`${analyticsEmojiPrefix}.skintone.select`, {
        skinTone,
      });
    }
  };

  render() {
    const { emoji } = this.props;
    const toneEmojis: EmojiDescription[] = extractAllTones(emoji);

    return (
      <div>
        {toneEmojis.map((tone, i) => (
          <EmojiButton
            key={`${tone.id}`}
            // tslint:disable-next-line:jsx-no-lambda
            onSelected={() => this.onToneSelectedHandler(i)}
            emoji={tone}
            selectOnHover={true}
          />
        ))}
      </div>
    );
  }
}

// tslint:disable-next-line:variable-name
const ToneSelector = withAnalytics<typeof ToneSelectorInternal>(
  ToneSelectorInternal,
  {},
  {},
);
type ToneSelector = ToneSelectorInternal;

export default ToneSelector;
