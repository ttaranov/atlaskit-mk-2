/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass, StyledFunction } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, HTMLProps } from 'react';
import { Href, HrefProps } from '../../utils/href';

export const A = styled(Href)`
  color: initial;

  /* !important is required to override @atlaskit/renderer styles */
  text-decoration: none !important;
  /* We need to do this to make TS happy */
  ${(props: HrefProps) => ''};
` as StyledComponentClass<HrefProps, any>;
