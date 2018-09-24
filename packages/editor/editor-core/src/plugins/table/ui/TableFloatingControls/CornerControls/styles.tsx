import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ButtonHTMLAttributes, ComponentClass } from 'react';
import { LineMarkerDefault } from '../styles';
import { tableInsertColumnButtonSize } from '../../styles';

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
