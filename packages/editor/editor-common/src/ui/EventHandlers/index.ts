import { CardEvent, Identifier } from '@atlaskit/media-card';
import { SyntheticEvent } from 'react';
import { AppCardAction, ActionMarkAction } from '../../schema';

export interface CardSurroundings {
  collectionName: string;
  list: Identifier[];
}

export type MentionEventHandler = (
  mentionId: string,
  text: string,
  event?: SyntheticEvent<HTMLSpanElement>,
) => void;
export type CardEventClickHandler = (
  result: CardEvent,
  surroundings?: CardSurroundings,
  analyticsEvent?: any,
) => void;
export type AppCardEventClickHandler = (url?: string) => void;
export type AppCardActionEventClickHandler = (action: AppCardAction) => void;
export type ActionEventClickHandler = (action: ActionMarkAction) => void;

export interface MentionEventHandlers {
  onClick?: MentionEventHandler;
  onMouseEnter?: MentionEventHandler;
  onMouseLeave?: MentionEventHandler;
}

export interface EventHandlers {
  mention?: MentionEventHandlers;
  media?: {
    onClick?: CardEventClickHandler;
  };
  applicationCard?: {
    onClick?: AppCardEventClickHandler;
    onActionClick?: AppCardActionEventClickHandler;
  };
  action?: {
    onClick?: ActionEventClickHandler;
  };
}
