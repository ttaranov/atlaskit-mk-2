import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ButtonHTMLAttributes, ComponentClass } from 'react';
import { tableBorderDeleteColor, tableToolbarDeleteColor } from '../../styles';
import { LineMarkerDefault } from '../styles';
import {
  tableInsertColumnButtonSize,
  tableToolbarSize,
  tableBorderColor,
  tableBorderRadiusSize,
  tableBorderSelectedColor,
  tableToolbarSelectedColor,
  tableToolbarColor,
} from '../../styles';

export const CornerContainer: ComponentClass<HTMLAttributes<{}>> = styled.div`
  width: ${tableToolbarSize}px;
  height: ${tableToolbarSize}px;

  display: none;

  .ProseMirror .with-controls & {
    display: block;
  }
`;

export const CornerButton: ComponentClass<
  ButtonHTMLAttributes<{}>
> = styled.button`
  position: absolute;
  top: 0;
  width: ${tableToolbarSize}px;
  height: ${tableToolbarSize}px;
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
    z-index: 1;
  }
  &:focus {
    outline: none;
  }
  &.danger {
    border: 1px solid ${tableBorderDeleteColor};
    background: ${tableToolbarDeleteColor};
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
