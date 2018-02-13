// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { akColorN100 } from '@atlaskit/util-shared-styles';

import {
  mentionListWidth,
  noDialogContainerBorderColor,
  noDialogContainerBorderRadius,
  noDialogContainerBoxShadow,
} from '../../shared-styles';

export interface MentionPickerStyleProps {
  visible?: boolean | string;
}

// tslint:disable:next-line variable-name
export const MentionPickerStyle = styled.div`
  display: ${(props: MentionPickerStyleProps) =>
    props.visible ? 'block' : 'none'};
`;

// tslint:disable:next-line variable-name
export const MentionPickerInfoStyle = styled.div`
  background: #fff;
  color: ${akColorN100};
  border: 1px solid ${noDialogContainerBorderColor};
  border-radius: ${noDialogContainerBorderRadius};
  box-shadow: ${noDialogContainerBoxShadow}
  display: block;
  width: ${mentionListWidth};
  white-space: nowrap;

  & {
    p {
      margin: 0;
      overflow: hidden;
      padding: 9px;
      text-overflow: ellipsis;
    }
  }
`;
