// @ts-ignore

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

import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import {
  ELEMENTS_CHANNEL,
  EventType,
  GasPayload,
} from '@atlaskit/analytics-gas-types';

import {
  name as packageName,
  version as packageVersion,
} from '../../../package.json';

export type OwnProps = {
  emoji: EmojiDescriptionWithVariations;
  onToneSelected: OnToneSelected;
};

export type OldAnalytics = {
  firePrivateAnalyticsEvent?: FireAnalyticsEvent;
};

export type NewAnalytics = {
  createAnalyticsEvent: any;
};

export type Props = OwnProps & OldAnalytics & NewAnalytics;

const extractAllTones = (
  emoji: EmojiDescriptionWithVariations,
): EmojiDescription[] => {
  if (emoji.skinVariations) {
    return [emoji, ...emoji.skinVariations];
  }
  return [emoji];
};

const emojiPayload = (actionSubject: string, action: string): GasPayload => {
  return {
    action,
    actionSubject,
    eventType: EventType.UI,
    attributes: {
      packageName,
      packageVersion,
      componentName: 'emoji',
    },
  };
};

const EmojiButtonWithAnalytics = withAnalyticsEvents({
  onSelected: createEvent => createEvent(emojiPayload('selected', 'skinTone')),
})(EmojiButton);

export class ToneSelectorInternal extends PureComponent<Props, {}> {
  private onToneSelectedHandler = (skinTone: number, analyticsEvent: any) => {
    const { onToneSelected, firePrivateAnalyticsEvent } = this.props;
    onToneSelected(skinTone);

    if (firePrivateAnalyticsEvent) {
      firePrivateAnalyticsEvent(`${analyticsEmojiPrefix}.skintone.select`, {
        skinTone,
      });
    }
    analyticsEvent &&
      analyticsEvent
        .update({
          attributes: {
            ...analyticsEvent.payload.attributes,
            skinTone,
          },
        })
        .fire(ELEMENTS_CHANNEL);
  };

  render() {
    const { emoji } = this.props;
    const toneEmojis: EmojiDescription[] = extractAllTones(emoji);

    return (
      <div>
        {toneEmojis.map((tone, i) => (
          <EmojiButtonWithAnalytics
            key={`${tone.id}`}
            // tslint:disable-next-line:jsx-no-lambda
            onSelected={analyticsEvent =>
              this.onToneSelectedHandler(i, analyticsEvent)
            }
            emoji={tone}
            selectOnHover={true}
          />
        ))}
      </div>
    );
  }
}

// tslint:disable-next-line:variable-name
const ToneSelector: React.ComponentClass<OwnProps> = withAnalytics<
  typeof ToneSelectorInternal
>(ToneSelectorInternal, {}, {}) as React.ComponentClass<OwnProps>;

type ToneSelector = ToneSelectorInternal;

export default ToneSelector;
