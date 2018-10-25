import * as React from 'react';
import { Card } from '@atlaskit/smart-card';
import { EventHandlers } from '@atlaskit/editor-common';

import { getEventHandler } from '../../utils';

export default function InlineCard(props: {
  url?: string;
  data?: object;
  eventHandlers?: EventHandlers;
}) {
  const { url, data, eventHandlers } = props;
  const handler = getEventHandler(eventHandlers, 'smartCard');
  return (
    <Card
      appearance="inline"
      url={url}
      data={data}
      onClick={() => {
        if (url && handler) {
          handler(url);
        }
      }}
    />
  );
}
