// @flow

import React, { Component, type Node } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';
import Field from './Field';

type Props = {
  /** The time of the comment. */
  children?: Node,
  /** The URL of the link. If not provided, the element will be rendered as text. */
  href?: string,
  /** Handler called when the element is clicked. */
  onClick?: Function,
  /** Handler called when the element is focused. */
  onFocus?: Function,
  /** Handler called when the element is moused over. */
  onMouseOver?: Function,
};

class Time extends Component<Props> {
  render() {
    const { children, href, onClick, onFocus, onMouseOver } = this.props;
    return (
      <Field
        href={href}
        onClick={onClick}
        onFocus={onFocus}
        onMouseOver={onMouseOver}
      >
        {children}
      </Field>
    );
  }
}

export { Time as CommentTimeWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'commentTime',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onClick: createAndFireEventOnAtlaskit({
      action: 'clicked',
      actionSubject: 'commentTime',

      attributes: {
        componentName: 'commentTime',
        packageName,
        packageVersion,
      },
    }),
  })(Time),
);
