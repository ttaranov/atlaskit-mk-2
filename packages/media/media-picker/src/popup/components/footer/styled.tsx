import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import Button, { Props as ButtonProps } from '@atlaskit/button';

export const Wrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  justify-content: flex-end;

  height: 80px;
  padding: 26px 15px 23px 18px;
`;

export const InsertButton: ComponentClass<
  HTMLAttributes<{}> & ButtonProps
> = styled(Button)`
  margin-right: 5px;
` as any;

export const CancelButton: ComponentClass<
  HTMLAttributes<{}> & ButtonProps
> = styled(Button)``;
