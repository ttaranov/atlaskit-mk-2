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
import EditedStyles from '../styled/EditedStyles';

type Props = {
  /** Content to render indicating that the comment has been edited. */
  children?: Node,
  /** Handler called when the element is focused. */
  onFocus?: Function,
  /** Handler called when the element is moused over. */
  onMouseOver?: Function,
};

class Edited extends Component<Props, {}> {
  render() {
    const { children, onFocus, onMouseOver } = this.props;
    return (
      <EditedStyles onFocus={onFocus} onMouseOver={onMouseOver}>
        {children}
      </EditedStyles>
    );
  }
}

export { Edited as CommentEditedWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'commentEdited',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onClick: createAndFireEventOnAtlaskit({
      action: 'clicked',
      actionSubject: 'commentEdited',

      attributes: {
        componentName: 'commentEdited',
        packageName,
        packageVersion,
      },
    }),
  })(Edited),
);
