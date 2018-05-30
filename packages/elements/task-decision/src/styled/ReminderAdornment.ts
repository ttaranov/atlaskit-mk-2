import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { borderRadius, colors } from '@atlaskit/theme';

export const Layer: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: fixed;
  top: 100px;
  left: 100px;
  width: 300px;
  background-color: ${colors.N0};
  border-radius: ${borderRadius()}px;
  margin-top: 5px;
  padding: 8px;
  box-shadow: 0 4px 8px -2px ${colors.N50A}, 0 0 1px ${colors.N60A};
`;
