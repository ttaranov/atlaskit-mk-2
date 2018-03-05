// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { akBorderRadius, akColorN60A } from '@atlaskit/util-shared-styles';

// tslint:disable-next-line:variable-name
export const Dropdown = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: ${akBorderRadius};
  box-shadow: 0 4px 8px -2px ${akColorN60A}, 0 0 1px ${akColorN60A};
  box-sizing: border-box;
  padding: 4px 0;
`;
