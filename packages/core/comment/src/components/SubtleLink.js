// @flow

import React, { type Node } from 'react';
import {
  withAnalyticsEvents,
  createAndFireEvent,
  type UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import Button from '@atlaskit/button';
import { name, version } from '../../package.json';

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
  /** Used to replace the button's analytics context. */
  analyticsContext: { [string]: any },
};

const SubtleLink = ({
  onClick,
  onFocus,
  onMouseOver,
  analyticsContext,
  children,
}: Props) => (
  /* eslint-disable jsx-a11y/no-static-element-interactions */
  <span onClick={onClick} onFocus={onFocus} onMouseOver={onMouseOver}>
    <Button
      appearance="subtle-link"
      spacing="none"
      type="button"
      analyticsContext={{ ...analyticsContext, package: name, version }}
    >
      {children}
    </Button>
  </span>
  /* eslint-enable jsx-a11y/no-static-element-interactions */
);

export { SubtleLink as SubtleLinkWithoutAnalytics };

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');
export default withAnalyticsEvents({
  onClick: createAndFireEventOnAtlaskit({ action: 'click' }),
  onFocus: createAndFireEventOnAtlaskit({ action: 'focus' }),
  onMouseOver: createAndFireEventOnAtlaskit({ action: 'mouseover' }),
})(SubtleLink);
