import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { ListenerProps, FabricChannel } from '../types';

import { handleEvent } from './handle-event';
import { event } from './types';

export const EDITOR_TAG = 'fabricEditor';

export default class FabricEditorListener extends React.Component<
  ListenerProps
> {
  handleEvent = (event: event) => {
    handleEvent(event, EDITOR_TAG, this.props.client, this.props.logger);
  };

  render() {
    return (
      <AnalyticsListener
        onEvent={this.handleEvent}
        channel={FabricChannel.editor}
      >
        {this.props.children}
      </AnalyticsListener>
    );
  }
}
