// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
import { css, StyledComponentClass, Styles } from 'styled-components';
import { akColorN900, akColorN300 } from '@atlaskit/util-shared-styles';

export const title = css`
  color: ${akColorN900};
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
`;

export const description = css`
  color: ${akColorN300};
  font-size: 12px;
  line-height: 16px;
`;
