/* tslint:disable variable-name */
import styled from 'styled-components';

export interface IFrameProps {
  isLoading: boolean;
}

export const Iframe = styled.iframe`
  border: none;
  border-radius: 3px;

  ${({ isLoading }: IFrameProps) => {
    if (isLoading) {
      return `
        visibility: hidden;
        overflow: hidden;
        width: 480px;
        height: 360px;
      `;
    } else {
      return '';
    }
  }};
`;
