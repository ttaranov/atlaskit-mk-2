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

import { EventType, GasPayload } from '@atlaskit/analytics-gas-types';
import {
  name as packageName,
  version as packageVersion,
} from '../../../package.json';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

const MENTION_ANALYTICS_PREFIX = 'atlassian.fabric.mention';
const ANALYTICS_HOVER_DELAY = 1000;
const ELEMENTS_CHANNEL = 'fabric-elements';

export type OwnProps = {
  id: string;
  text: string;
  isHighlighted?: boolean;
  accessLevel?: string;
  onClick?: MentionEventHandler;
  onMouseEnter?: MentionEventHandler;
  onMouseLeave?: MentionEventHandler;
};

export type OldAnalytics = {
  fireAnalyticsEvent?: FireAnalyticsEvent;
  firePrivateAnalyticsEvent?: FireAnalyticsEvent;
};

export type NewAnalytics = {
  createAnalyticsEvent: any;
};

export type Props = OwnProps & OldAnalytics & NewAnalytics;

const mentionPayload = (
  actionSubject: string,
  action: string,
  props,
): GasPayload => {
  const { accessLevel, text } = props;

  return {
    action,
    actionSubject,
    eventType: EventType.UI,
    attributes: {
      packageName,
      packageVersion,
      componentName: 'mention',
      accessLevel,
      isSpecial: isSpecialMentionText(text),
    },
    tags: [ELEMENTS_CHANNEL],
    source: 'unknown',
  };
};

export class MentionInternal extends React.PureComponent<Props, {}> {
  private startTime: number = 0;

  private handleOnClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    const { id, text, onClick } = this.props;
    if (onClick) {
      onClick(id, text, e);
    }
    this.fireAnalytics('lozenge.select');
  };

  private handleOnMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    const { id, text, onMouseEnter } = this.props;
    this.startTime = Date.now();
    if (onMouseEnter) {
      onMouseEnter(id, text, e);
    }
  };

  private handleOnMouseLeave = (
    e: React.MouseEvent<HTMLSpanElement>,
    analyticsEvent?: any,
  ) => {
    const { id, text, onMouseLeave } = this.props;
    if (onMouseLeave) {
      onMouseLeave(id, text, e);
    }
    const duration: number = Date.now() - this.startTime;

    if (duration > ANALYTICS_HOVER_DELAY) {
      this.fireAnalytics('lozenge.hover');
      analyticsEvent && analyticsEvent.fire(ELEMENTS_CHANNEL);
    }
    this.startTime = 0;
  };

  private fireAnalytics = (eventName: string) => {
    const { accessLevel, text, firePrivateAnalyticsEvent } = this.props;

    if (firePrivateAnalyticsEvent) {
      firePrivateAnalyticsEvent(`${MENTION_ANALYTICS_PREFIX}.${eventName}`, {
        accessLevel,
        isSpecial: isSpecialMentionText(text),
      });
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
const Mention = withAnalytics<typeof MentionInternal>(MentionInternal, {}, {});
type Mention = MentionInternal;

const MentionWithAnalytics: React.ComponentClass<
  OwnProps
> = withAnalyticsEvents({
  onClick: (createEvent, props) =>
    createEvent(mentionPayload('lozenge', 'selected', props)).fire(
      ELEMENTS_CHANNEL,
    ),
  onMouseLeave: (createEvent, props) =>
    createEvent(mentionPayload('lozenge', 'hovered', props)).fire(
      ELEMENTS_CHANNEL,
    ),
})(Mention) as React.ComponentClass<OwnProps>;

export default MentionWithAnalytics;
