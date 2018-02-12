/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
import { HTMLAttributes, ClassAttributes } from 'react';
import { akFontFamily } from '@atlaskit/util-shared-styles';
import { fadeIn } from './animations';

export * from './config';
export * from './mixins';
export * from './easing';
export * from './animations';

export const Root = styled.div`
  box-sizing: border-box;
  font-family: ${akFontFamily};

  * {
    box-sizing: border-box;
  }
`;

export const cardShadow = `
  box-shadow: 0 1px 1px rgba(9, 30, 66, 0.2), 0 0 1px 0 rgba(9, 30, 66, 0.24);
`;
// Reference: http://proto/shadows/
export const linkCardShadow = `
  box-shadow: 0 0 1px 0 rgba(23, 43, 77, 0.24);`;

export const FadeinImage = styled.div`
  ${fadeIn};
`;

export default Root;
