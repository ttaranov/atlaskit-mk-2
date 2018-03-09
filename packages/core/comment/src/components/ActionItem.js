// @flow

import React, { type Node } from 'react';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import SubtleLink from './SubtleLink';

type Props = {
  /** The content to render inside the action button. */
  children?: Node,
  /** Handler called when the element is clicked. The second argument can be used
   * to track analytics events. See documentation in analytics-next package for details. */
  onClick?: (e: SyntheticEvent<>, analyticsEvent: UIAnalyticsEvent) => void,
  /** Handler called when the element is focused. The second argument can be used
   * to track analytics events. See documentation in analytics-next package for details. */
  onFocus?: (e: SyntheticEvent<>, analyticsEvent: UIAnalyticsEvent) => void,
  /** Handler called when the element is moused over. The second argument can be used
   * to track analytics events. See documentation in analytics-next package for details. */
  onMouseOver?: (e: SyntheticEvent<>, analyticsEvent: UIAnalyticsEvent) => void,
};

const ActionItem = ({ children, onClick, onFocus, onMouseOver }: Props) => (
  <SubtleLink
    onClick={onClick}
    onFocus={onFocus}
    onMouseOver={onMouseOver}
    analyticsContext={{ component: 'comment-action' }}
  >
    {children}
  </SubtleLink>
);

export default ActionItem;
