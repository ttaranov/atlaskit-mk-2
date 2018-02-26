// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ButtonHTMLAttributes } from 'react';
import {
  akEditorTableBorderRadius,
  akEditorTableBorder,
  akEditorTableBorderSelected,
  akEditorTableToolbarSize,
} from '../../../styles';
import {
  HeaderButtonDefault,
  InsertMarkerDefault,
  InsertButtonDefault,
  LineMarkerDefault,
} from '../styles';

// tslint:disable-next-line:variable-name
export const ColumnContainer = styled.div`
  position: absolute;
  top: -${akEditorTableToolbarSize - 1}px;
  left: 0;
  height: ${akEditorTableToolbarSize}px;
  box-sizing: border-box;
  display: none;

  .with-controls & {
    display: block;
  }
`;
// tslint:disable-next-line:variable-name
export const ColumnInner = styled.div`
  display: flex;
  & > div:last-child > button {
    border-top-right-radius: ${akEditorTableBorderRadius};
  }
`;
// tslint:disable-next-line:variable-name
export const ColumnControlsButtonWrap = styled.div`
  position: relative;
  margin-right: -1px;
  &:hover,
  &.active {
    z-index: 1;
  }
`;
// tslint:disable-next-line:variable-name
export const HeaderButton = styled(HeaderButtonDefault)`
  border-right: 1px solid ${akEditorTableBorder};
  border-bottom: none;
  border-radius: 0;
  height: ${akEditorTableToolbarSize - 1}px;
  width: 100%;

  &:hover,
  .active > &,
  .tableHovered & {
    border-bottom: 1px solid ${akEditorTableBorderSelected};
    height: ${akEditorTableToolbarSize}px;
  }
`;
// tslint:disable-next-line:variable-name
export const InsertColumnButtonWrap = styled.div`
  position: absolute;
  top: -20px;
  right: -10px;
  height: 20px;
  width: 20px;
  z-index: 2;
  cursor: pointer;
  &:hover > div {
    display: flex;
  }
`;
// tslint:disable-next-line:variable-name
export const InsertColumnMarker = styled(InsertMarkerDefault)`
  bottom: 3px;
  left: 7px;
`;
// tslint:disable-next-line:variable-name
export const InsertColumnButtonInner = styled(InsertButtonDefault)`
  top: 5px;
`;
// tslint:disable-next-line:variable-name
export const ColumnLineMarker = styled(LineMarkerDefault)`
  width: 2px;
  left: 8px;
  top: 20px;
`;
