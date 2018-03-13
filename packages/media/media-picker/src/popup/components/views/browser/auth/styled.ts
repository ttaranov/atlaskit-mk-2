// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import {
  akColorN30,
  akColorN100,
  akColorN500,
} from '@atlaskit/util-shared-styles';

export const IconWrapper = styled.div`
  color: ${akColorN30};
  display: flex;
  align-items: center;
  justify-content: center;

  > span {
    width: 120px;
    height: 120px;

    svg {
      width: 100%;
      height: 100%;
    }
  }
`;

export const ButtonWrapper = styled.div`
  text-align: center;
`;

export const TextDescription = styled.div`
  margin-top: 18px;
  color: ${akColorN500};
  opacity: 0.7;
  font-size: 12px;
  text-align: center;
`;

export const Title = styled.div`
  text-align: center;
  font-size: 16px;
  color: ${akColorN100};
`;

export const ConnectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
