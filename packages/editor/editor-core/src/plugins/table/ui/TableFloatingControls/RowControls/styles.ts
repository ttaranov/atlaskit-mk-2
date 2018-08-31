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
  tableToolbarSize,
} from '../../styles';
import {
  akEditorUnitZIndex,
  akEditorSmallZIndex,
} from '@atlaskit/editor-common';

export const RowContainer: ComponentClass<HTMLAttributes<{}>> = styled.div`
  width: ${tableToolbarSize}px;
  display: none;

  .ProseMirror .with-controls & {
    display: block;
  }
`;

export const RowInner: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  flex-direction: column;
  & > div.table-row.last > button {
    border-bottom-left-radius: ${tableBorderRadiusSize}px;
  }
`;

export const RowControlsButtonWrap: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  position: relative;
  margin-top: -1px;

  &.active {
    z-index: ${akEditorUnitZIndex};
  }
`;

export const HeaderButton: ComponentClass<ButtonHTMLAttributes<{}>> = styled(
  HeaderButtonDefault,
)`
  border-bottom: 1px solid ${tableBorderColor};
  border-right: 1px solid ${tableBorderColor};
  border-radius: 0;
  height: 100%;
  width: ${tableToolbarSize + 1}px;

  .table-container[data-number-column='true'] & {
    border-right-width: 0;
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
  z-index: ${akEditorSmallZIndex};
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
