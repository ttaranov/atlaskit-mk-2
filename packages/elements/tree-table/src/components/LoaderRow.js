// @flow
import React, { PureComponent } from 'react';
import Spinner from '@atlaskit/spinner';

import DataCell from './DataCell';
import { TreeRowContainer, ChevronContainer } from '../styled';

type Props = {
  isCompleting: boolean,
  onComplete: Function,
  depth?: number,
};

export default class LoaderRow extends PureComponent<Props> {
  static defaultProps = {
    depth: 1,
  };

  render() {
    const { isCompleting, depth, onComplete } = this.props;
    return (
      <TreeRowContainer>
        <DataCell indentLevel={depth}>
          <ChevronContainer>
            <Spinner
              isCompleting={isCompleting}
              onComplete={onComplete}
              delay={100}
              size="small"
              invertColor={false}
            />
          </ChevronContainer>
        </DataCell>
      </TreeRowContainer>
    );
  }
}
