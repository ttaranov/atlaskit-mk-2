import { akColorN10 } from '@atlaskit/util-shared-styles';
import { akBorderRadius } from '@atlaskit/util-shared-styles';
import styled, { css } from 'styled-components';

// tslint:disable-next-line:variable-name
export const Container = styled.div`
  border-radius: ${akBorderRadius};
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  padding: 4px 8px 4px 4px;
  background-color: ${akColorN10};
  ${({ height }) =>
    height
      ? css`
          height: ${height}px;
        `
      : ''};
`;
