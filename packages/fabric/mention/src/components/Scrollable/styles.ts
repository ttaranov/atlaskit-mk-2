// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { akBorderRadius } from '@atlaskit/util-shared-styles';
import { scrollableMaxHeight } from '../../shared-styles';

// tslint:disable:next-line variable-name
export const ScrollableStyle = styled.div`
  display: block;
  overflow-x: hidden;
  overflow-y: auto;

  padding: 4px 0;
  margin: 0;

  background: white;
  max-height: ${scrollableMaxHeight};

  border-radius: ${akBorderRadius};
`;
