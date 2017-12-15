// @flow
import styled from 'styled-components';
import React from 'react';
import { colors } from '@atlaskit/theme';
import Spinner from '@atlaskit/spinner';
import Icon from '@atlaskit/icon/glyph/warning';

// exported for testing
export const WarningIcon = styled.div`
  align-items: center;
  color: ${colors.yellow};
  display: flex;
  flex-shrink: 0;
`;

// Spinner needs set height to avoid height jumping
// Also needs a margin so there is space between it and preceding text
const SpinnerParent = styled.div`
  height: 20px;
  margin-left: 10px;
`;

// TODO: Fix the strict mode no dupes error from flow
// $FlowFixMe
const ValidationElement = ({ isDisabled, isInvalid, isLoading }) => {
  if (!isDisabled && isInvalid) {
    return (
      <WarningIcon>
        <Icon label="warning" />
      </WarningIcon>
    );
  }

  return isLoading ? (
    <SpinnerParent>
      <Spinner size="small" />
    </SpinnerParent>
  ) : null;
};

export default ValidationElement;
