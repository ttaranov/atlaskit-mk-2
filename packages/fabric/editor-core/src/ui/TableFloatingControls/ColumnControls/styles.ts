import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ButtonHTMLAttributes, ComponentClass } from 'react';
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

export const ColumnContainer: ComponentClass<HTMLAttributes<{}>> = styled.div`
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

export const ColumnInner: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  & > div:last-child > button {
    border-top-right-radius: ${akEditorTableBorderRadius};
  }
`;

export const ColumnControlsButtonWrap: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  position: relative;
  margin-right: -1px;
  &:hover,
  &.active {
    z-index: 1;
  }
`;

export const HeaderButton: ComponentClass<ButtonHTMLAttributes<{}>> = styled(
  HeaderButtonDefault,
)`
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

export const InsertColumnButtonWrap: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
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

export const InsertColumnMarker: ComponentClass<HTMLAttributes<{}>> = styled(
  InsertMarkerDefault,
)`
  bottom: 3px;
  left: 7px;
`;

export const InsertColumnButtonInner: ComponentClass<
  HTMLAttributes<{}>
> = styled(InsertButtonDefault)`
  top: 5px;
`;

export const ColumnLineMarker: ComponentClass<HTMLAttributes<{}>> = styled(
  LineMarkerDefault,
)`
  width: 2px;
  left: 8px;
  top: 20px;
`;
