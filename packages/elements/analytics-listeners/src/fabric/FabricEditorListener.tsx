import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { ListenerProps, FabricChannel } from '../types';

import { handleEvent } from './handle-event';
import { UIAnalyticsEventInterface } from '@atlaskit/analytics-next-types';

export const EDITOR_TAG = 'fabricEditor';

export default class FabricEditorListener extends React.Component<
  ListenerProps
> {
  handleEventWrapper = (event: UIAnalyticsEventInterface) => {
    handleEvent(event, EDITOR_TAG, this.props.logger, this.props.client);
  };

  render() {
    return (
      <AnalyticsListener
        onEvent={this.handleEventWrapper}
        channel={FabricChannel.editor}
      >
        {this.props.children}
      </AnalyticsListener>
    );
  }
}
