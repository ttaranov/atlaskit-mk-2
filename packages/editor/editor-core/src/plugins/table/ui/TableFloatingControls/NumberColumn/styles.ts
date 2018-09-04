import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ButtonHTMLAttributes, ComponentClass } from 'react';
import {
  akEditorTableNumberColumnWidth,
  akEditorTableBorder,
  akEditorTableToolbarSize,
  akEditorUnitZIndex,
} from '@atlaskit/editor-common';
import {
  tableToolbarColor,
  tableBorderSelectedColor,
  tableBorderDeleteColor,
  tableToolbarDeleteColor,
  tableToolbarSelectedColor,
} from '../../styles';
import {
  akColorN0,
  akColorN200,
  akColorR500,
} from '@atlaskit/util-shared-styles';

export const NumberColumnContainer: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  position: relative;
  float: right;
  margin-left: ${akEditorTableToolbarSize - 1}px;
  top: ${akEditorTableToolbarSize}px;

  width: ${akEditorTableNumberColumnWidth + 1}px;
  box-sizing: border-box;

  border-left: 1px solid ${akEditorTableBorder};

  .with-controls & {
    border-left: 0 none;
    padding-left: 1px;
  }
`;

export const StyledNumberedRow: ComponentClass<HTMLAttributes<{}>> = styled.div`
  border-top: 1px solid ${akEditorTableBorder};
  border-right: 1px solid ${akEditorTableBorder};
  box-sizing: border-box;

  margin-top: -1px;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    border-bottom: 1px solid ${akEditorTableBorder};
  }

  padding: 10px;
  text-align: center;

  background-color: ${tableToolbarColor};
  color: ${akColorN200};

  border-color: ${akEditorTableBorder};

  .with-controls & {
    cursor: pointer;
  }

  .with-controls &:hover,
  .with-controls &.active,
  .with-controls &.tableHovered {
    border-bottom: 1px solid ${tableBorderSelectedColor};
    border-color: ${tableBorderSelectedColor};

    background-color: ${tableToolbarSelectedColor};
    position: relative;
    z-index: ${akEditorUnitZIndex};

    color: ${akColorN0};
  }

  .with-controls &.danger {
    background-color: ${tableToolbarDeleteColor};
    border: 1px solid ${tableBorderDeleteColor};
    color: ${akColorR500};
    position: relative;
    z-index: ${akEditorUnitZIndex};
  }
`;
