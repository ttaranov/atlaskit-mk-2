import * as React from 'react';

import MentionItem from '../src/components/MentionItem';
import { generateMentionItem, onSelection } from '../example-helpers';

export default function Example() {
  const mention = {
    id: '666',
    name: 'Craig Petchell',
    mentionName: 'petch',
  };
  const description = 'Simple mention item with no nickname or avatar';
  const component = <MentionItem mention={mention} onSelection={onSelection} />;

  return generateMentionItem(component, description);
}
