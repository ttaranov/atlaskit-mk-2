import * as React from 'react';
import { StatelessComponent, Children, ReactElement } from 'react';

import { DecisionItem as AkDecisionItem } from '@atlaskit/task-decision';

export interface Props {
  children?: ReactElement<any>;
}

const DecisionItem: StatelessComponent<Props> = ({ children }: Props) => {
  if (Children.count(children) === 0) {
    return null;
  }

  return <AkDecisionItem>{children}</AkDecisionItem>;
};

export default DecisionItem;
