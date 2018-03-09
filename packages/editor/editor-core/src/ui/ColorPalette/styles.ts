import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { akGridSize } from '@atlaskit/util-shared-styles';

export const ColorPaletteWrapper: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  padding: 0 ${akGridSize};
  /* Firefox bug fix: https://product-fabric.atlassian.net/browse/ED-1789 */
  display: flex;
  flex-wrap: wrap;
`;
