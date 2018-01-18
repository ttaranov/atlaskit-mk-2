import * as React from 'react';
import { mentions } from '../src/support/story-data';
import {
  MentionDescription,
  OnMentionEvent,
  MentionEventHandler,
} from '../src/types';
import debug from '../src/util/logger';

export const generateMentionItem = (
  component: JSX.Element,
  description?: string,
) => (
  <div>
    <p>{description}</p>
    <ul style={{ padding: 0 }}>{component}</ul>
  </div>
);

export const randomMentions = () => mentions.filter(() => Math.random() < 0.7);

export const onSelection: OnMentionEvent = (mention: MentionDescription) =>
  debug('onSelection ', mention);

export const onMentionEvent: MentionEventHandler = (
  mentionId: string,
  text: string,
  e: React.SyntheticEvent<HTMLSpanElement>,
) => debug(mentionId, text, e.type);
