/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { akColorN500 } from '@atlaskit/util-shared-styles';
import { Root, borderRadius, size, center } from '../../styles';

export const Wrapper = styled(Root)`
  display: flex;
  position: relative;
`;

// We need to set a explicit value to the Icon (svg) wrapper since otherwise will grow up too much
export const MeatBallsWrapper = styled.div`
  width: 23px;
`;

export const DeleteBtn = styled.div`
  ${center} ${borderRadius} ${size(26)} color: ${akColorN500};

  &:hover {
    cursor: pointer;
    background-color: rgba(9, 30, 66, 0.06);
  }
`;
