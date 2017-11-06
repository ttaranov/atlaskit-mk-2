import * as React from 'react';
import { PureComponent, Children, ReactElement } from 'react';

import { DecisionItem as AkDecisionItem } from '@atlaskit/task-decision';

export interface Props {
  children?: ReactElement<any>
}

export default class DecisionItem extends PureComponent<Props, {}> {
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
