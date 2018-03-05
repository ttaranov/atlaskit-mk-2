// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ButtonHTMLAttributes } from 'react';
import {
  akEditorTableToolbarSize,
  akEditorTableBorder,
  akEditorTableBorderRadius,
  akEditorTableBorderSelected,
  akEditorTableToolbarSelected,
} from '../../../styles';
import { LineMarkerDefault } from '../styles';

// tslint:disable-next-line:variable-name
export const CornerContainer = styled.div`
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

// tslint:disable-next-line:variable-name
export const CornerButton = styled.button`
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: ${akEditorTableToolbarSize}px;
  height: ${akEditorTableToolbarSize}px;
  background-image: linear-gradient(
    to bottom right,
    #fff 0,
    #fff 49%,
    ${akEditorTableBorder} 50%,
    ${akEditorTableBorder} 100%
  );
  box-shadow: inset 0 0 0 1px #fff;
  border: 1px solid ${akEditorTableBorder};
  border-radius: 0;
  border-top-left-radius: ${akEditorTableBorderRadius};
  cursor: pointer;
  padding: 0;

  &:hover,
  .active > &,
  .tableHovered & {
    background-image: linear-gradient(
      to bottom right,
      #fff 0,
      #fff 49%,
      ${akEditorTableToolbarSelected} 50%,
      ${akEditorTableToolbarSelected} 100%
    );
    border-color: ${akEditorTableBorderSelected};
    z-index: 1;
  }
  &:focus {
    outline: none;
  }
`;
// tslint:disable-next-line:variable-name
export const ColumnLineMarker = styled(LineMarkerDefault)`
  width: 2px;
  left: 8px;
  top: 20px;
`;
// tslint:disable-next-line:variable-name
export const RowLineMarker = styled(LineMarkerDefault)`
  height: 2px;
  top: 8px;
  left: 20px;
`;
