// StyledComponentClass and React are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';

import {
  mentionListWidth,
  noDialogContainerBorderColor,
  noDialogContainerBorderRadius,
  noDialogContainerBoxShadow,
} from '../../shared-styles';

export interface MentionListStyleProps {
  empty?: boolean;
}

// tslint:disable:next-line variable-name
export const MentionListStyle = styled.div`
  display: ${(props: MentionListStyleProps) =>
    props.empty ? 'none' : 'block'};

  /* list style */
  width: ${mentionListWidth};
  color: #333;

  border: 1px solid ${noDialogContainerBorderColor};
  border-radius: ${noDialogContainerBorderRadius};
  box-shadow: ${noDialogContainerBoxShadow};
`;
