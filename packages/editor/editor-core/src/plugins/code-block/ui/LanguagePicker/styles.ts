import { ComponentClass } from 'react';
import styled from 'styled-components';
import ToolbarButtonDefault from '../../../../ui/ToolbarButton';

export const TrashToolbarButton: ComponentClass<any> = styled(
  ToolbarButtonDefault,
)`
  && {
    width: 24px;
    max-width: 24px;
  }
`;
