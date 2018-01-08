// @flow
import React, { PureComponent } from 'react';
import Spinner from '@atlaskit/spinner';

import { Cell, TreeRowContainer, LoaderItemContainer } from '../styled';

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
          <LoaderItemContainer isRoot={depth === 1}>
            <Spinner
              isCompleting={isCompleting}
              onComplete={onComplete}
              delay={100}
              size="small"
              invertColor={false}
            />
          </LoaderItemContainer>
        </Cell>
      </TreeRowContainer>
    );
  }
}
