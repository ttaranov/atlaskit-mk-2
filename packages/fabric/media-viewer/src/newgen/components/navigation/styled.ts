import styled, {css} from 'styled-components';
import { akColorN900 } from '@atlaskit/util-shared-styles';

interface CardProps {
  selected: boolean;
}
export const Card = styled.span`
  ${({ selected }: CardProps) => {
    let bgColor = akColorN900;
    let textColor = 'white';
    if (selected) {
      bgColor = 'yellow';
      textColor = akColorN900;
    }
    return css`
    background-color: ${bgColor};
    color: ${textColor};
    `;  
  }}
  padding: 5px 10px;
  width: 50px;
  height: 50px;
  display: inline-block;
`;

export const Filmstrip = styled.div`

`;
