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
  tableToolbarSize,
  tableBorderColor,
} from '../../styles';

export const ColumnContainer: ComponentClass<HTMLAttributes<{}>> = styled.div`
  height: ${tableToolbarSize}px;
  box-sizing: border-box;
  display: none;

  .with-controls & {
    display: block;
  }
`;

export const ColumnInner: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  & > div.last > button {
    border-top-right-radius: ${tableBorderRadiusSize}px;
  }
`;

export const ColumnControlsButtonWrap: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  position: relative;
  margin-right: -1px;

  &.active {
    z-index: 1;
  }
`;

export const HeaderButton: ComponentClass<ButtonHTMLAttributes<{}>> = styled(
  HeaderButtonDefault,
)`
  border-right: 1px solid ${tableBorderColor};
  border-bottom: none;
  height: ${tableToolbarSize}px;
  width: 100%;
  &:hover {
    z-index: 1;
    position: relative;
  }
`;

export const InsertColumnButtonWrap: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  position: absolute;
  top: -${tableInsertColumnButtonSize}px;
  right: -${tableInsertColumnButtonSize / 2}px;
  height: ${tableInsertColumnButtonSize}px;
  width: ${tableInsertColumnButtonSize}px;
  z-index: 2;
  cursor: pointer;
  &:hover > div {
    display: flex;
  }
`;

export const DeleteColumnButtonWrap: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  position: absolute;
  top: -${tableDeleteColumnButtonSize + 6}px;
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

export const InsertColumnMarker: ComponentClass<HTMLAttributes<{}>> = styled(
  InsertMarkerDefault,
)`
  bottom: 3px;
  left: 7px;
`;

export const InsertColumnButtonInner: ComponentClass<
  HTMLAttributes<{}>
> = styled(InsertButtonDefault)`
  top: 5px;
`;

export const ColumnLineMarker: ComponentClass<HTMLAttributes<{}>> = styled(
  LineMarkerDefault,
)`
  width: 2px;
  left: 8px;
  top: ${tableInsertColumnButtonSize}px;
`;
