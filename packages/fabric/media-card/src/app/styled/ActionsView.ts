/* tslint:disable:variable-name */
import styled from 'styled-components';
import {
  akGridSizeUnitless,
  akColorR400,
  akColorN0,
} from '@atlaskit/util-shared-styles';
import { center } from '../../styles';

export interface MessageProps {
  tryAgain?: boolean;
}

export const Actions = styled.div`
  ${center} font-size: 14px;
`;

export const ActionsMenu = styled.div`
  display: flex;
  margin-left: ${akGridSizeUnitless / 2}px;
`;

const Message = styled.span`
  margin-right: ${({ tryAgain }: MessageProps) => (tryAgain ? 0 : 5)}px;
`;

export const FailureMessageBlock = styled.div``;

export const FailureMessage = styled(Message)`
  color: ${akColorR400};
  vertical-align: middle;
  margin-left: 5px;
` as any;

export const SuccessMessage = styled(Message)``;

export const ActionButtonWrapper = styled.div`
  margin-left: 5px;
`;

export const ButtonWrapper = styled.div`
  ${({ isDark }: { isDark: boolean }) => {
    if (isDark) {
      return `

        /* former styles to look good on darker background */
        & > button {

          color: ${akColorN0} !important;
          background-color: rgba(255, 255, 255, .08);

          &:hover {
            background: hsla(0,0%,100%,.12);
          }

          &:active {
            background: rgba(76,154,255,.32);
          }

          &:focus {
            box-shadow: 0 0 0 2px rgba(38,132,255,.6);
          }
        }

      `;
    } else {
      return '';
    }
  }};
`;
