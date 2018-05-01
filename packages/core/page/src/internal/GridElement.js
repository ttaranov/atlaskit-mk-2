// @flow
import styled from 'styled-components';

import { defaultGridColumnWidth, spacing } from './vars';

// flowlint-next-line unclear-type:off
const getMargin = (props: any) =>
  props.theme.isNestedGrid ? `-${spacing[props.theme.spacing]}px` : 'auto';
// flowlint-next-line unclear-type:off
const getMaxWidth = (props: any) =>
  props.layout === 'fixed'
    ? `${defaultGridColumnWidth * props.theme.columns}px`
    : '100%';
// flowlint-next-line unclear-type:off
const getPadding = (props: any) => `${spacing[props.theme.spacing] / 2}px`;

const Grid = styled.div`
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  margin: 0 ${getMargin};
  max-width: ${getMaxWidth};
  padding: 0 ${getPadding};
  position: relative;
`;

export default Grid;
export { getMargin, getMaxWidth, getPadding };
