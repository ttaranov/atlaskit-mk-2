import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { cardTitle, cardDescription, ellipsis } from '@atlaskit/media-ui';

export const Icon: ComponentClass<{ src?: string }> = styled.img`
  width: 58px;
  height: 58px;
`;

export const Title: ComponentClass<HTMLAttributes<{}>> = styled.div`
  margin-bottom: 8px;
  ${cardTitle} ${ellipsis('100%')};
`;

export const Description: ComponentClass<HTMLAttributes<{}>> = styled.div`
  margin-bottom: 8px;
  ${cardDescription};
`;

export const ButtonGroup: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  justify-content: flex-end;

  > * + * {
    margin-left: 4px;
  }
`;
