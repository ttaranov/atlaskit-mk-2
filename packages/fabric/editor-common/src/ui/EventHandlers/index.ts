import { CardEvent } from '@atlaskit/media-card';
import { SyntheticEvent } from 'react';
import { AppCardAction } from '../../schema';

export interface CardSurroundings {
    collectionName: string;
    list: string[];
}

export type MentionEventHandler = (mentionId: string, text: string, event?: SyntheticEvent<HTMLSpanElement>) => void;
export type CardEventClickHandler = (result: CardEvent, surroundings?: CardSurroundings) => void;
export type AppCardEventClickHandler = (url?: string) => void;
export type AppCardActionEventClickHandler = (action: AppCardAction) => void;

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
}
