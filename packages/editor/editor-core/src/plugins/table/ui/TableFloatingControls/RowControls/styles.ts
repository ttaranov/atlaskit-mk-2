import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ButtonHTMLAttributes, ComponentClass } from 'react';
import {
  HeaderButtonDefault,
  InsertMarkerDefault,
  InsertButtonDefault,
  LineMarkerDefault,
} from '../styles';
import {
  tableInsertColumnButtonSize,
  tableDeleteColumnButtonSize,
  tableBorderRadiusSize,
  tableBorderColor,
  tableBorderSelectedColor,
  tableToolbarSize,
  tableBorderDeleteColor,
} from '../../styles';

export const RowContainer: ComponentClass<HTMLAttributes<{}>> = styled.div`
  width: ${tableToolbarSize}px;
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
    border-bottom-left-radius: ${tableBorderRadiusSize}px;
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
  border-bottom: 1px solid ${tableBorderColor};
  border-radius: 0;
  height: 100%;
  width: ${tableToolbarSize - 1}px;

  &:hover,
  .active > &,
  .tableHovered & {
    border-right: 1px solid ${tableBorderSelectedColor};
    width: ${tableToolbarSize}px;
  }

  .danger > & {
    border-right: 1px solid ${tableBorderDeleteColor};
  }
`;

export const InsertRowButtonWrap: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  position: absolute;
  bottom: -${tableInsertColumnButtonSize / 2}px;
  left: -${tableInsertColumnButtonSize}px;
  height: ${tableInsertColumnButtonSize}px;
  width: ${tableInsertColumnButtonSize}px;
  z-index: 2;
  cursor: pointer;
  &:hover > div {
    display: flex;
  }
`;

export const DeleteRowButtonWrap: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  position: absolute;
  bottom: -${tableInsertColumnButtonSize / 2}px;
  left: -${tableDeleteColumnButtonSize + 6}px;
  height: ${tableDeleteColumnButtonSize}px;
  width: ${tableDeleteColumnButtonSize}px;
  z-index: 2;
  cursor: pointer;
  & > div {
    display: flex;
  }

  & > div,
  & > div button {
    width: ${tableDeleteColumnButtonSize}px;
    height: ${tableDeleteColumnButtonSize}px;
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
  left: ${tableInsertColumnButtonSize}px;
`;
