// @flow
import React, { PureComponent } from 'react';
import Spinner from '@atlaskit/spinner';

import { type DataFunction } from './../types';

import TreeCell from './TreeCell';
import { TreeRowContainer, ChevronContainer } from '../styled';

type Props = {
  isCompleting: boolean,
  onComplete: Function,
  depth?: number,
};

export default class Loader extends PureComponent<Props> {
  static defaultProps = {
    depth: 1,
  };

  render() {
    const { isCompleting, depth, onComplete } = this.props;
    return (
      <TreeRowContainer>
        <TreeCell indentLevel={depth}>
          <ChevronContainer>
            <Spinner
              delay={100}
              invertColor={false}
              onComplete={onComplete}
              size="small"
              isCompleting={isCompleting}
            />
          </ChevronContainer>
        </TreeCell>
      </TreeRowContainer>
    );
  }
}
