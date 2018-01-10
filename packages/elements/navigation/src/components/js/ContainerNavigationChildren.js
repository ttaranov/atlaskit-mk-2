// @flow
import React from 'react';

import ScrollHintWrapper from '../styled/ScrollHintWrapper';
import ScrollHintScrollContainer from '../styled/ScrollHintScrollContainer';
import type { ReactElement } from '../../types';

type Props = {
  children?: ReactElement,
  hasScrollHintTop?: boolean,
  scrollRef?: () => void,
};

const ContainerNavigationChildren = ({
  children,
  hasScrollHintTop,
  scrollRef,
}: Props) => (
  <ScrollHintWrapper
    hasScrollHintTop={hasScrollHintTop}
  >
    <ScrollHintScrollContainer innerRef={scrollRef}>
      {children}
    </ScrollHintScrollContainer>
  </ScrollHintWrapper>
);
ContainerNavigationChildren.displayName = 'ContainerNavigationChildren';
export default ContainerNavigationChildren;
