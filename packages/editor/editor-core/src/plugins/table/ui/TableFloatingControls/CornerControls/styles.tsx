import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ButtonHTMLAttributes, ComponentClass } from 'react';
import {
  akEditorTableToolbarSize,
  akEditorTableBorder,
  akEditorTableBorderRadius,
  akEditorTableBorderSelected,
  akEditorTableToolbarSelected,
} from '../../../../../styles';
import { LineMarkerDefault } from '../styles';
import { akEditorTableToolbar } from '@atlaskit/editor-common';

export const CornerContainer: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: absolute;
  top: -${akEditorTableToolbarSize}px;
  left: -${akEditorTableToolbarSize}px;
  width: ${akEditorTableToolbarSize}px;
  height: ${akEditorTableToolbarSize}px;

  display: none;

  .ProseMirror .with-controls & {
    display: block;
  }
`;

export const CornerButton: ComponentClass<
  ButtonHTMLAttributes<{}>
> = styled.button`
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: ${akEditorTableToolbarSize}px;
  height: ${akEditorTableToolbarSize}px;
  border: 1px solid ${akEditorTableBorder};
  border-radius: 0;
  border-top-left-radius: ${akEditorTableBorderRadius};
  background: ${akEditorTableToolbar};
  cursor: pointer;
  padding: 0;

  &:hover,
  .active > &,
  .tableHovered & {
    border-color: ${akEditorTableBorderSelected};
    background: ${akEditorTableToolbarSelected};
    z-index: 1;
  }
  &:focus {
    outline: none;
  }
`;

export const ColumnLineMarker: ComponentClass<HTMLAttributes<{}>> = styled(
  LineMarkerDefault,
)`
  width: 2px;
  left: 8px;
  top: 20px;
`;

export const RowLineMarker: ComponentClass<HTMLAttributes<{}>> = styled(
  LineMarkerDefault,
)`
  height: 2px;
  top: 8px;
  left: 20px;
`;
