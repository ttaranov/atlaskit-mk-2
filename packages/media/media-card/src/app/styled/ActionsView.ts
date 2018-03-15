/* tslint:disable:variable-name */

import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import {
  akGridSizeUnitless,
  akColorR400,
  akColorN0,
} from '@atlaskit/util-shared-styles';
import { center } from '../../styles';

export interface MessageProps {
  tryAgain?: boolean;
}

export const Actions: ComponentClass<HTMLAttributes<{}>> = styled.div`
  ${center} font-size: 14px;
`;

export const ActionsMenu: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  margin-left: ${akGridSizeUnitless / 2}px;
`;

const Message: ComponentClass<HTMLAttributes<{}> & MessageProps> = styled.span`
  margin-right: ${({ tryAgain }: MessageProps) => (tryAgain ? 0 : 5)}px;
`;

export const FailureMessageBlock: ComponentClass<
  HTMLAttributes<{}>
> = styled.div``;

export const FailureMessage: ComponentClass<
  HTMLAttributes<{}> & MessageProps
> = styled(Message)`
  color: ${akColorR400};
  vertical-align: middle;
  margin-left: 5px;
` as any;

export const SuccessMessage: ComponentClass<
  HTMLAttributes<{}> & MessageProps
> = styled(Message)``;

export const ActionButtonWrapper: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  margin-left: 5px;
`;

export interface ButtonWrapperProps {
  isDark: boolean;
}

export const ButtonWrapper: ComponentClass<
  HTMLAttributes<{}> & ButtonWrapperProps
> = styled.div`
  ${({ isDark }: ButtonWrapperProps) => {
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
