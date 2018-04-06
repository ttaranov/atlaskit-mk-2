import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';

export const Wrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: 8px;
`;
