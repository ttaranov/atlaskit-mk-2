import * as React from 'react';
import { MentionStyle, MentionContainer } from './styles';
import Tooltip from '@atlaskit/tooltip';
import {
  isRestricted,
  MentionType,
  isSpecialMentionText,
  MentionEventHandler,
} from '../../types';
import { FireAnalyticsEvent, withAnalytics } from '@atlaskit/analytics';

import { GasPayload } from '@atlaskit/analytics-gas-types';
import {
  name as packageName,
  version as packageVersion,
} from '../../../package.json';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { ELEMENTS_CHANNEL } from '../../constants';

const MENTION_ANALYTICS_PREFIX = 'atlassian.fabric.mention';
export const ANALYTICS_HOVER_DELAY = 1000;

export type OwnProps = {
  id: string;
  text: string;
  isHighlighted?: boolean;
  accessLevel?: string;
  onClick?: MentionEventHandler;
  onMouseEnter?: MentionEventHandler;
  onMouseLeave?: MentionEventHandler;
  onHover?: () => void;
};

export type OldAnalytics = {
  fireAnalyticsEvent?: FireAnalyticsEvent;
  firePrivateAnalyticsEvent?: FireAnalyticsEvent;
};

export type Props = OwnProps & OldAnalytics;

const mentionPayload = (
  actionSubject: string,
  action: string,
  { accessLevel, text }: Props,
): GasPayload => ({
  action,
  actionSubject,
  eventType: 'ui',
  attributes: {
    packageName,
    packageVersion,
    componentName: 'mention',
    accessLevel,
    isSpecial: isSpecialMentionText(text),
  },
  source: 'unknown',
});

const fireAnalytics = (eventName: string, props: Props) => {
  const { accessLevel, text, firePrivateAnalyticsEvent } = props;

  if (firePrivateAnalyticsEvent) {
    firePrivateAnalyticsEvent(`${MENTION_ANALYTICS_PREFIX}.${eventName}`, {
      accessLevel,
      isSpecial: isSpecialMentionText(text),
    });
  }
};

export class MentionInternal extends React.PureComponent<Props, {}> {
  private hoverTimeout?: number;

  private handleOnClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    const { id, text, onClick } = this.props;
    if (onClick) {
      onClick(id, text, e);
    }
  };

  private handleOnMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    const { id, text, onMouseEnter, onHover } = this.props;
    if (onMouseEnter) {
      onMouseEnter(id, text, e);
    }
    this.hoverTimeout = setTimeout(() => {
      if (onHover) {
        onHover();
      }
      this.hoverTimeout = undefined;
    }, ANALYTICS_HOVER_DELAY);
  };

  private handleOnMouseLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    const { id, text, onMouseLeave } = this.props;
    if (onMouseLeave) {
      onMouseLeave(id, text, e);
    }
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
  };

  private getMentionType = (): MentionType => {
    const { accessLevel, isHighlighted } = this.props;
    if (isHighlighted) {
      return MentionType.SELF;
    }
    if (isRestricted(accessLevel)) {
      return MentionType.RESTRICTED;
    }
    return MentionType.DEFAULT;
  };

  componentWillUnmount() {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
  }

  render() {
    const {
      handleOnClick,
      handleOnMouseEnter,
      handleOnMouseLeave,
      props,
    } = this;
    const { text, id, accessLevel } = props;
    const mentionType: MentionType = this.getMentionType();

    const mentionComponent = (
      <MentionStyle
        mentionType={mentionType}
        onClick={handleOnClick}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        {text}
      </MentionStyle>
    );

    return (
      <MentionContainer
        data-mention-id={id}
        data-access-level={accessLevel}
        spellCheck={false}
      >
        {mentionType === MentionType.RESTRICTED ? (
          <Tooltip
            content={`${props.text} won't be notified as they have no access`}
            position="right"
          >
            {mentionComponent}
          </Tooltip>
        ) : (
          mentionComponent
        )}
      </MentionContainer>
    );
  }
}

// tslint:disable-next-line:variable-name
const MentionWithAnalytics: React.ComponentClass<
  OwnProps
> = withAnalyticsEvents({
  onClick: (createEvent, props: Props) => {
    createEvent(mentionPayload('mention', 'selected', props)).fire(
      ELEMENTS_CHANNEL,
    );

    // old analytics
    fireAnalytics('lozenge.select', props);
  },

  onHover: (createEvent, props) => {
    createEvent(mentionPayload('mention', 'hovered', props)).fire(
      ELEMENTS_CHANNEL,
    );

    // old analytics
    fireAnalytics('lozenge.hover', props);
  },
})(MentionInternal) as React.ComponentClass<OwnProps>;

const Mention = withAnalytics<typeof MentionWithAnalytics>(
  MentionWithAnalytics,
  {},
  {},
);
type Mention = MentionInternal;

export default Mention;
