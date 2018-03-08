// @flow

import React, { type Node } from 'react';
import {
  withAnalyticsEvents,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import Button from '@atlaskit/button';

type Props = {
  /** The content to render inside the action button. */
  children?: Node,
  /** Handler called when the element is clicked. */
  onClick?: Function,
  /** Handler called when the element is focused. */
  onFocus?: Function,
  /** Handler called when the element is moused over. */
  onMouseOver?: Function,
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
      analyticsContext={analyticsContext}
    >
      {children}
    </Button>
  </span>
  /* eslint-enable jsx-a11y/no-static-element-interactions */
);

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');
export default withAnalyticsEvents({
  onClick: createAndFireEventOnAtlaskit({ action: 'click' }),
  onFocus: createAndFireEventOnAtlaskit({ action: 'focus' }),
  onMouseOver: createAndFireEventOnAtlaskit({ action: 'mouseover' }),
})(SubtleLink);
