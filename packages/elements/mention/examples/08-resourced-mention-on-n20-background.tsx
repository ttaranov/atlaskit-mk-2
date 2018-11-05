import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics';
import { colors } from '@atlaskit/theme';
import debug from '../src/util/logger';
import { onMentionEvent } from '../example-helpers/index';
import {
  mockMentionData as mentionData,
  mockMentionProvider as mentionProvider,
} from '../src/__tests__/unit/_test-helpers';
import ResourcedMention from '../src/components/Mention/ResourcedMention';

const style = {
  backgroundColor: colors.N20,
  width: '100%',
  height: '800px',
};

const padding = { padding: '10px' };

function listenerHandler(eventName: string, eventData: Object) {
  debug(`AnalyticsListener event: ${eventName} `, eventData);
}

export default function Example() {
  return (
    <div style={style}>
      <div style={padding}>
        <AnalyticsListener onEvent={listenerHandler} matchPrivate={true}>
          <ResourcedMention
            {...mentionData}
            accessLevel={'CONTAINER'}
            mentionProvider={mentionProvider}
            onClick={onMentionEvent}
            onMouseEnter={onMentionEvent}
            onMouseLeave={onMentionEvent}
          />
        </AnalyticsListener>
      </div>
      <div style={padding}>
        <ResourcedMention
          id="oscar"
          text="@Oscar Wallhult"
          mentionProvider={mentionProvider}
          onClick={onMentionEvent}
          onMouseEnter={onMentionEvent}
          onMouseLeave={onMentionEvent}
        />
      </div>
      <div style={padding}>
        <ResourcedMention
          {...mentionData}
          accessLevel={'NONE'}
          mentionProvider={mentionProvider}
          onClick={onMentionEvent}
          onMouseEnter={onMentionEvent}
          onMouseLeave={onMentionEvent}
        />
      </div>
    </div>
  );
}
