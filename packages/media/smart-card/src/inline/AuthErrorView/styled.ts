import styled from 'styled-components';
import { ComponentClass, HTMLAttributes } from 'react';
import { colors } from '@atlaskit/theme';
import { Wrapper } from '../Frame/styled';

export const ViewWrapper: ComponentClass<HTMLAttributes<{}>> = styled(Wrapper)`
  &:hover {
    background-color: ${colors.N20};
  }
`;

export const IconWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  vertical-align: middle;
  display: inline-block;
  line-height: ${16 / 12};
`;
