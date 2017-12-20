// @flow
import React, { Component, type Node } from 'react';
import Spinner from '@atlaskit/spinner';
import type { SpinnerSizeType } from '../types';

import { LARGE, LOADING_CONTENTS_OPACITY } from '../internal/constants';
import {
  Container,
  ContentsContainer,
  SpinnerContainer,
} from '../styled/LoadingContainer';

type Props = {
  children: Node,
  isLoading?: boolean,
  spinnerSize?: SpinnerSizeType,
  contentsOpacity?: number,
};
export default class LoadingContainer extends Component<Props, {}> {
  static defaultProps = {
    isLoading: true,
    spinnerSize: LARGE,
    contentsOpacity: LOADING_CONTENTS_OPACITY,
  };

  render() {
    const { children, isLoading, spinnerSize, contentsOpacity } = this.props;

    return (
      <Container>
        {!isLoading ? (
          children
        ) : (
          <ContentsContainer contentsOpacity={contentsOpacity}>
            {children}
          </ContentsContainer>
        )}
        {isLoading && (
          <SpinnerContainer>
            <Spinner size={spinnerSize} />
          </SpinnerContainer>
        )}
      </Container>
    );
  }
}
