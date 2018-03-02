/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';

export const AvatarPickerViewWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 339px;
`;

export const ModalHeader = styled.div`
  margin: 15px;
  font-weight: 500;
`;

export const CroppingWrapper = styled.div`
  display: inline-block;
`;

export const ModalFooterButtons = styled.div`
  text-align: right;
  width: 100%;
`;
