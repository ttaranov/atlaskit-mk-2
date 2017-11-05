import * as React from 'react';
import { PureComponent, Children } from 'react';

import { DecisionList as AkDecisionList, DecisionItem } from '@atlaskit/task-decision';

export type Props = {
  children?: DecisionItem | Array<DecisionItem>
};

export default class DecisionList extends PureComponent<Props, {}> {
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
