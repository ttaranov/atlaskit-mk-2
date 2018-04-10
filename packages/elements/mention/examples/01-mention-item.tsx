import * as React from 'react';

import MentionItem from '../src/components/MentionItem';
import {
  generateMentionItem,
  onSelection,
  sampleAvatarUrl as avatarUrl,
} from '../example-helpers';

export default function Example() {
  const mention = {
    avatarUrl,
    id: '666',
    name: 'Craig Petchell',
    mentionName: 'cpetchell',
    nickname: 'petch',
    selected: true,
    presence: {
      status: 'online',
      time: '11:23am',
    },
    accessLevel: 'SITE',
    highlight: {
      name: [
        {
          start: 6,
          end: 10,
        },
      ],
      mentionName: [],
      nickname: [
        {
          start: 0,
          end: 4,
        },
      ],
    },
  };
  const description =
    'Selected mention with nickname, avatar, highlights presence, lozenge and restricted access';
  const component = (
    <MentionItem
      mention={mention}
      selected={mention.selected}
      onSelection={onSelection}
    />
  );

  return generateMentionItem(component, description);
}
