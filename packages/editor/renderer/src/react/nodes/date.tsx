import * as React from 'react';
import { PureComponent } from 'react';
import {
  isPastDate,
  timestampToString,
  timestampToTaskContext,
} from '@atlaskit/editor-common';

export interface Props {
  timestamp: string;
  parentIsIncompleteTask?: boolean;
}

export default class Date extends PureComponent<Props, {}> {
  render() {
    const { timestamp, parentIsIncompleteTask } = this.props;
    const className =
      !!parentIsIncompleteTask && isPastDate(timestamp)
        ? 'date-node date-node-highlighted'
        : 'date-node';
    return (
      <span
        className={className}
        data-node-type="date"
        data-timestamp={timestamp}
      >
        {parentIsIncompleteTask
          ? timestampToTaskContext(timestamp)
          : timestampToString(timestamp)}
      </span>
    );
  }
}
