// @flow
import React, { PureComponent } from 'react';
import Spinner from '@atlaskit/spinner';

import { Cell, TreeRowContainer, LoaderContainer } from '../styled';

type Props = {
  isCompleting: boolean,
  onComplete: Function,
  depth?: number,
};

export default class LoaderItem extends PureComponent<Props> {
  static defaultProps = {
    depth: 1,
  };

  render() {
    const { isCompleting, depth, onComplete } = this.props;
    return (
      <TreeRowContainer>
        <Cell indentLevel={depth} width={'100%'}>
          <LoaderContainer isRoot={depth === 1}>
            <Spinner
              isCompleting={isCompleting}
              onComplete={onComplete}
              delay={100}
              size="small"
              invertColor={false}
            />
          </LoaderContainer>
        </Cell>
      </TreeRowContainer>
    );
  }
}
