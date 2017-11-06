import * as React from 'react';
import { PureComponent, Children } from 'react';

import { DecisionItem as AkDecisionItem } from '@atlaskit/task-decision';

export default class DecisionItem extends PureComponent<{}, {}> {
  render() {
    const { children } = this.props;

    if (Children.count(children) === 0) {
      return null;
    }

    return (
      <AkDecisionItem>{children}</AkDecisionItem>
    );
  }
}
