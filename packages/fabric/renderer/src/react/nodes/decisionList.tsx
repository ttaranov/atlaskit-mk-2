import * as React from 'react';
import { PureComponent, Children } from 'react';

import { DecisionList as AkDecisionList } from '@atlaskit/task-decision';

export default class DecisionList extends PureComponent<{}, {}> {
  render() {
    const { children } = this.props;

    if (Children.count(children) === 0) {
      return null;
    }

    return (
      <div className="akDecisionList"><AkDecisionList>{children}</AkDecisionList></div>
    );
  }
}
