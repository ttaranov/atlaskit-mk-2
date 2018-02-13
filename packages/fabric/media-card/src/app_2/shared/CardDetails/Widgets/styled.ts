// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { akColorN300, akColorN800 } from '@atlaskit/util-shared-styles';
import { ellipsis } from '../../../../styles';

const widgetHeight = 28;

export const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
  margin-top: auto;

  height: ${widgetHeight}px;
  overflow: hidden;

  & > * + * {
    margin-left: 8px;
  }
`;

export const WidgetWrapper = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  height: ${widgetHeight}px;
  max-width: calc(100% - (2 * 8px));
`;

export const WidgetDetails = styled.div`
  display: flex;
  align-items: center;

  /* space the widget items */
  & > * + * {
    margin-left: 2px;
  }
`;

export const Title = styled.div`
  color: ${akColorN300};
  font-size: 12px;
  line-height: 16px;
`;

export const Text = styled.div`
  ${ellipsis('none')};
  color: ${akColorN800};
  font-size: 12px;
  line-height: 16px;
`;
