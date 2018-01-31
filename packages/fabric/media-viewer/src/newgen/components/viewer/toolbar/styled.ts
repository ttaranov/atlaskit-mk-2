import styled, {css} from 'styled-components';
import { akColorN900 } from '@atlaskit/util-shared-styles';

export interface ButtonProps {
  active: boolean;
}

export const Wrapper = styled.div`
  border: 1px solid ${akColorN900};
  padding: 5px 10px;
  width: 400px;
`;

export const Button = styled.button`
  ${({ active }: ButtonProps) => {
    let bgColor = akColorN900;
    let textColor = 'white';
    if (active) {
      bgColor = 'yellow';
      textColor = akColorN900;
    }
    return css`
    background-color: ${bgColor};
    color: ${textColor};
    `;  
  }}
  width: 70px;
  height: 30px;
  border-radius: 3px;
`;