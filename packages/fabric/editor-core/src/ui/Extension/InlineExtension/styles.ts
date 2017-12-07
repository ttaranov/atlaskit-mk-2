import styled from 'styled-components';
import { akBorderRadius } from '@atlaskit/util-shared-styles';
import {
  padding,
  Wrapper as WrapperDefault,
  PlaceholderFallback as PlaceholderFallbackDefault,
} from '../styles';

// tslint:disable-next-line:variable-name
export const Wrapper = styled(WrapperDefault)`
  cursor: pointer;
  display: inline-flex;

  > img {
    border-radius: ${akBorderRadius};
  }

  &::after,
  &::before {
    vertical-align: text-top;
    display: inline-block;
    width: 1px;
    content: '';
  }
`;

// tslint:disable-next-line:variable-name
export const PlaceholderFallback = styled(PlaceholderFallbackDefault)`
  padding: ${padding}px;
`;
