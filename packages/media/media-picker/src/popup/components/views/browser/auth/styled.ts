import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import {
  akColorN30,
  akColorN100,
  akColorN500,
} from '@atlaskit/util-shared-styles';

export const IconWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
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

export const ButtonWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  text-align: center;
`;

export const TextDescription: ComponentClass<HTMLAttributes<{}>> = styled.div`
  margin-top: 18px;
  color: ${akColorN500};
  opacity: 0.7;
  font-size: 12px;
  text-align: center;
`;

export const Title: ComponentClass<HTMLAttributes<{}>> = styled.div`
  text-align: center;
  font-size: 16px;
  color: ${akColorN100};
`;

export const ConnectWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
