import * as React from 'react';
import Mention from '../src/components/Mention';
import { AnalyticsListener } from '@atlaskit/analytics';
import debug from '../src/util/logger';
import { onMentionEvent } from '../example-helpers/index';
import { mockMentionData as mentionData } from '../__tests__/_test-helpers';

const padding = { padding: '10px' };

function listenerHandler(eventName: string, eventData: Object) {
  debug(`AnalyticsListener event: ${eventName} `, eventData);
}

export default function Example() {
  return (
    <div>
      <div style={padding}>
        <AnalyticsListener onEvent={listenerHandler} matchPrivate={true}>
          <Mention
            {...mentionData}
            accessLevel={'CONTAINER'}
            onClick={onMentionEvent}
            onMouseEnter={onMentionEvent}
            onMouseLeave={onMentionEvent}
          />
        </AnalyticsListener>
      </div>
      <div style={padding}>
        <Mention
          {...mentionData}
          isHighlighted={true}
          onClick={onMentionEvent}
          onMouseEnter={onMentionEvent}
          onMouseLeave={onMentionEvent}
        />
      </div>
      <div style={padding}>
        <Mention
          {...mentionData}
          accessLevel={'NONE'}
          onClick={onMentionEvent}
          onMouseEnter={onMentionEvent}
          onMouseLeave={onMentionEvent}
        />
      </div>
    </div>
  );
}
