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

export const RowContainer: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: absolute;
  top: 1px;
  left: -${akEditorTableToolbarSize - 1}px;
  width: ${akEditorTableToolbarSize}px;
  box-sizing: border-box;
  display: none;

  .ProseMirror .with-controls & {
    display: block;
  }
`;

export const RowInner: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  flex-direction: column;
  & > div:last-child > button {
    border-bottom-left-radius: ${akEditorTableBorderRadius};
  }
`;

export const RowControlsButtonWrap: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  position: relative;
  margin-top: -1px;
  &:hover,
  &.active {
    z-index: 1;
  }
`;

export const HeaderButton: ComponentClass<ButtonHTMLAttributes<{}>> = styled(
  HeaderButtonDefault,
)`
  border-right: none;
  border-bottom: 1px solid ${akEditorTableBorder};
  border-radius: 0;
  height: 100%;
  width: ${akEditorTableToolbarSize - 1}px;

  &:hover,
  .active > &,
  .tableHovered & {
    border-right: 1px solid ${akEditorTableBorderSelected};
    width: ${akEditorTableToolbarSize}px;
  }
`;

export const InsertRowButtonWrap: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  position: absolute;
  bottom: -10px;
  left: -20px;
  height: 20px;
  width: 20px;
  z-index: 2;
  cursor: pointer;
  &:hover > div {
    display: flex;
  }
`;

export const InsertRowMarker: ComponentClass<HTMLAttributes<{}>> = styled(
  InsertMarkerDefault,
)`
  top: 7px;
  right: 3px;
`;

export const InsertRowButtonInner: ComponentClass<
  ButtonHTMLAttributes<{}>
> = styled(InsertButtonDefault)`
  left: 5px;
`;

export const RowLineMarker: ComponentClass<HTMLAttributes<{}>> = styled(
  LineMarkerDefault,
)`
  height: 2px;
  top: 8px;
  left: 20px;
`;
