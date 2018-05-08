import styled from 'styled-components';
import { tableMarginTop } from '@atlaskit/editor-common';

// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ButtonHTMLAttributes, ComponentClass } from 'react';
import {
  akEditorTableToolbarSelected,
  akEditorTableBorder,
  akEditorTableBorderSelected,
  akEditorTableToolbar,
  akEditorTableControlsHovered,
} from '../../../../styles';

export const Container: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: relative;

  .ProseMirror.table-resizing & {
    top: ${tableMarginTop - 2}px;
    display: none;
  }
  .ProseMirror.table-resizing .with-controls & {
    display: block;
  }
`;

export const HeaderButtonDefault: ComponentClass<
  ButtonHTMLAttributes<{}>
> = styled.button`
  background: ${akEditorTableToolbar};
  border-top: 1px solid ${akEditorTableBorder};
  border-left: 1px solid ${akEditorTableBorder};
  display: block;
  padding: 0;
  cursor: pointer;

  .active > &,
  .active > &:hover {
    background-color: ${akEditorTableToolbarSelected};
    border-color: ${akEditorTableBorderSelected};
  }
  &:hover,
  .tableHovered & {
    background-color: ${akEditorTableControlsHovered};
  }
  &:focus {
    outline: none;
  }
`;

export const InsertButtonDefault: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  position: absolute;
  z-index: 20;
  display: none;
  width: 20px;
  height: 20px;
  justify-content: center;
  & button {
    width: 100%;
  }
  & button * {
    width: 100%;
    height: 100%;
  }
`;

export const InsertMarkerDefault: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  background-color: ${akEditorTableBorder};
  position: absolute;
  height: 4px;
  width: 4px;
  border-radius: 50%;
  div:hover > & {
    background-color: ${akEditorTableBorderSelected};
  }
`;

export const LineMarkerDefault: ComponentClass<HTMLAttributes<{}>> = styled.div`
  background: ${akEditorTableBorderSelected};
  display: none;
  position: absolute;
  z-index: 1;
`;
