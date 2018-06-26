import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ButtonHTMLAttributes, ComponentClass } from 'react';
import { tableBorderDeleteColor, tableToolbarDeleteColor } from '../../styles';
import { LineMarkerDefault, Button } from '../styles';
import {
  tableInsertColumnButtonSize,
  tableToolbarSize,
  tableBorderColor,
  tableBorderRadiusSize,
  tableBorderSelectedColor,
  tableToolbarSelectedColor,
  tableToolbarColor,
} from '../../styles';
import {
  akEditorTableToolbarSize,
  akEditorTableNumberColumnWidth,
} from '@atlaskit/editor-common';

export const CornerContainer: ComponentClass<HTMLAttributes<{}>> = styled.div`
  width: ${tableToolbarSize + 1}px;
  height: ${tableToolbarSize + 1}px;

  display: none;

  .ProseMirror .with-controls & {
    display: block;
  }

  .table-container[data-number-column='true'] & {
    width: ${akEditorTableToolbarSize + akEditorTableNumberColumnWidth}px;
  }
`;

export const CornerButton: ComponentClass<ButtonHTMLAttributes<{}>> = styled(
  Button,
)`
  position: absolute;
  top: 0;
  width: ${tableToolbarSize + 1}px;
  height: ${tableToolbarSize + 1}px;
  border: 1px solid ${tableBorderColor};
  border-radius: 0;
  border-top-left-radius: ${tableBorderRadiusSize}px;
  background: ${tableToolbarColor};
  cursor: pointer;
  padding: 0;

  &:hover,
  .active > &,
  .tableHovered & {
    border-color: ${tableBorderSelectedColor};
    background: ${tableToolbarSelectedColor};
  }
  &:focus {
    outline: none;
  }
  &.danger {
    border-color: ${tableBorderDeleteColor};
    background: ${tableToolbarDeleteColor};
  }

  .table-container[data-number-column='true'] & {
    width: ${akEditorTableToolbarSize + akEditorTableNumberColumnWidth}px;
  }
`;

export const ColumnLineMarker: ComponentClass<HTMLAttributes<{}>> = styled(
  LineMarkerDefault,
)`
  width: 2px;
  left: 8px;
  top: ${tableInsertColumnButtonSize}px;
`;

export const RowLineMarker: ComponentClass<HTMLAttributes<{}>> = styled(
  LineMarkerDefault,
)`
  height: 2px;
  top: 8px;
  left: ${tableInsertColumnButtonSize}px;
`;
