// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ButtonHTMLAttributes } from 'react';
import {
  akEditorTableToolbarSelected,
  akEditorTableBorder,
  akEditorTableBorderSelected,
  akEditorTableToolbar,
} from '../../styles';

export const toolbarSize = 11;

// tslint:disable-next-line:variable-name
export const Container = styled.div`
  position: relative;

  .ProseMirror.table-resizing & {
    top: 28px;
    display: none;
  }
  .ProseMirror.table-resizing .with-controls & {
    display: block;
  }
`;
// tslint:disable-next-line:variable-name
export const HeaderButtonDefault = styled.button`
  background: ${akEditorTableToolbar};
  border-top: 1px solid ${akEditorTableBorder};
  border-left: 1px solid ${akEditorTableBorder};
  display: block;
  padding: 0;
  cursor: pointer;
  &:hover,
  .active > &,
  .tableHovered & {
    background-color: ${akEditorTableToolbarSelected};
    border-color: ${akEditorTableBorderSelected};
  }
  &:focus {
    outline: none;
  }
`;
// tslint:disable-next-line:variable-name
export const InsertButtonDefault = styled.div`
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
// tslint:disable-next-line:variable-name
export const InsertMarkerDefault = styled.div`
  background-color: ${akEditorTableBorder};
  position: absolute;
  height: 4px;
  width: 4px;
  border-radius: 50%;
  div:hover > & {
    background-color: ${akEditorTableBorderSelected};
  }
`;
// tslint:disable-next-line:variable-name
export const LineMarkerDefault = styled.div`
  background: ${akEditorTableBorderSelected};
  display: none;
  position: absolute;
  z-index: 1;
`;
