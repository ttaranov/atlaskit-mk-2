import * as React from 'react';
import Mention from '../src/components/Mention';
import { AnalyticsListener } from '@atlaskit/analytics';
import { AnalyticsListener as AnalyticsListenerNext } from '@atlaskit/analytics-next';
import debug from '../src/util/logger';
import { onMentionEvent } from '../example-helpers/index';
import { mockMentionData as mentionData } from '../src/__tests__/unit/_test-helpers';
import { ELEMENTS_CHANNEL } from '../src/constants';

const padding = { padding: '10px' };

function listenerHandler(eventName: string, eventData: Object) {
  debug(`listenerHandler event: ${eventName} `, eventData);
}

const listenerHandlerNext = e => {
  debug(
    'Analytics Next handler - payload:',
    e.payload,
    ' context: ',
    e.context,
  );
};

const handler = (
  mentionId: string,
  text: string,
  event?: any,
  analytics?: any,
) => {
  debug(
    'Old Analytics handler: ',
    text,
    ' ',
    event,
    ' - analytics: ',
    analytics,
  );
};

export default function Example() {
  return (
    <div>
      <div style={padding}>
        <AnalyticsListenerNext
          onEvent={listenerHandlerNext}
          channel={ELEMENTS_CHANNEL}
        >
          <AnalyticsListener onEvent={listenerHandler} matchPrivate={true}>
            <Mention
              {...mentionData}
              accessLevel={'CONTAINER'}
              onClick={handler}
              onMouseEnter={onMentionEvent}
              onMouseLeave={onMentionEvent}
            />
          </AnalyticsListener>
        </AnalyticsListenerNext>
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
