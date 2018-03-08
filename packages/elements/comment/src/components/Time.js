// @flow

import React, { Component, type Node } from 'react';
import {
  withAnalyticsEvents,
  createAndFireEvent,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';
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

export class Time extends Component<Props> {
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

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');
export default withAnalyticsContext({ component: 'comment-time' })(
  withAnalyticsEvents({
    onClick: createAndFireEventOnAtlaskit({ action: 'click' }),
    onFocus: createAndFireEventOnAtlaskit({ action: 'focus' }),
    onMouseOver: createAndFireEventOnAtlaskit({ action: 'mouseover' }),
  })(Time),
);
