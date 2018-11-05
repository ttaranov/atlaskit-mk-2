import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { colors } from '@atlaskit/theme';

import {
  mentionListWidth,
  noDialogContainerBorderColor,
  noDialogContainerBorderRadius,
  noDialogContainerBoxShadow,
} from '../../shared-styles';

export interface MentionPickerStyleProps {
  visible?: boolean | string;
}

export const MentionPickerStyle: ComponentClass<
  HTMLAttributes<{}> & MentionPickerStyleProps
> = styled.div`
  display: ${(props: MentionPickerStyleProps) =>
    props.visible ? 'block' : 'none'};
`;

export const MentionPickerInfoStyle: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  background: #fff;
  color: ${colors.N100};
  border: 1px solid ${noDialogContainerBorderColor};
  border-radius: ${noDialogContainerBorderRadius};
  box-shadow: ${noDialogContainerBoxShadow};
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
