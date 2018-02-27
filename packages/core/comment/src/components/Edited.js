// @flow

import React, { Component, type Node } from 'react';
import {
  withAnalyticsEvents,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import Button from '@atlaskit/button';

type Props = {
  /** Content to render indicating that the comment has been edited. */
  children?: Node,
  /** Handler called when the element is clicked. */
  onClick?: Function,
  /** Handler called when the element is focused. */
  onFocus?: Function,
  /** Handler called when the element is moused over. */
  onMouseOver?: Function,
};

export class Edited extends Component<Props, {}> {
  render() {
    const { children, onClick, onFocus, onMouseOver } = this.props;
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <span onClick={onClick} onFocus={onFocus} onMouseOver={onMouseOver}>
        <Button
          appearance="subtle-link"
          spacing="none"
          type="button"
          analyticsContext={{
            component: 'commment-edited',
          }}
        >
          {children}
        </Button>
      </span>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions */
  }
}

type CreateAnalyticsEvent = (payload: {
  [string]: any,
}) => UIAnalyticsEvent;

const createAndFireEvent = (action: string) => (
  createAnalyticsEvent: CreateAnalyticsEvent,
) => {
  const consumerEvent = createAnalyticsEvent({
    action,
  });
  consumerEvent.clone().fire('atlaskit');

  return consumerEvent;
};

export default withAnalyticsEvents({
  onClick: createAndFireEvent('click'),
  onFocus: createAndFireEvent('focus'),
  onMouseOver: createAndFireEvent('mouseover'),
})(Edited);
