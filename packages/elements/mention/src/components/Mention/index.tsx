import * as React from 'react';
import { MentionStyle } from './styles';
import Tooltip from '@atlaskit/tooltip';
import { isRestricted, MentionType, MentionEventHandler } from '../../types';
import { fireAnalyticsMentionEvent, fireAnalytics } from '../../util/analytics';

import { FireAnalyticsEvent, withAnalytics } from '@atlaskit/analytics';

import { withAnalyticsEvents } from '@atlaskit/analytics-next';

import {
  WithAnalyticsEventProps,
  CreateUIAnalyticsEventSignature,
  UIAnalyticsEventInterface,
} from '@atlaskit/analytics-next-types';

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

export type Props = OwnProps & OldAnalytics & WithAnalyticsEventProps;

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
      <span
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
      </span>
    );
  }
}

// tslint:disable-next-line:variable-name
const MentionWithAnalytics: React.ComponentClass<
  OwnProps
> = withAnalyticsEvents({
  onClick: (
    createEvent: CreateUIAnalyticsEventSignature,
    props: Props,
  ): UIAnalyticsEventInterface => {
    const { id, text, accessLevel, firePrivateAnalyticsEvent } = props;

    const event = fireAnalyticsMentionEvent(createEvent)(
      'mention',
      'selected',
      text,
      id,
      accessLevel,
    );

    // old analytics
    fireAnalytics(firePrivateAnalyticsEvent)(
      'lozenge.select',
      text,
      accessLevel,
    );
    return event;
  },

  onHover: (
    createEvent: CreateUIAnalyticsEventSignature,
    props: Props,
  ): UIAnalyticsEventInterface => {
    const { id, text, accessLevel, firePrivateAnalyticsEvent } = props;

    const event = fireAnalyticsMentionEvent(createEvent)(
      'mention',
      'hovered',
      text,
      id,
      accessLevel,
    );

    // old analytics
    fireAnalytics(firePrivateAnalyticsEvent)(
      'lozenge.hover',
      text,
      accessLevel,
    );
    return event;
  },
})(MentionInternal) as React.ComponentClass<OwnProps>;

const Mention = withAnalytics<typeof MentionWithAnalytics>(
  MentionWithAnalytics,
  {},
  {},
);
type Mention = MentionInternal;

export default Mention;
