import styled from 'styled-components';

// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ButtonHTMLAttributes, ComponentClass } from 'react';
import {
  akEditorTableToolbarSize,
  akEditorTableToolbar,
  akEditorTableBorder,
  akEditorTableBorderRadius,
  akEditorTableBorderSelected,
  akEditorTableToolbarSelected,
  akEditorTableControlsHovered,
} from '../../../../../styles';
import { LineMarkerDefault } from '../styles';

export const CornerContainer: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: absolute;
  top: -${akEditorTableToolbarSize - 1}px;
  left: -3px;
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
  left: 0;
  bottom: 0;
  width: ${akEditorTableToolbarSize}px;
  height: ${akEditorTableToolbarSize}px;
  background: ${akEditorTableToolbar};
  border: 1px solid ${akEditorTableBorder};
  border-radius: 0;
  border-top-left-radius: ${akEditorTableBorderRadius};
  cursor: pointer;
  padding: 0;

  &:hover,
  .tableHovered & {
    background: ${akEditorTableControlsHovered};
    z-index: 1;
  }
  .active > & {
    background: ${akEditorTableToolbarSelected};
    border-color: ${akEditorTableBorderSelected};
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
