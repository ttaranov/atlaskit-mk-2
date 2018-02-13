import styled from 'styled-components';
import { akBorderRadius } from '@atlaskit/util-shared-styles';
import { Wrapper as WrapperDefault } from '../styles';

// tslint:disable-next-line:variable-name
export const Wrapper = styled(WrapperDefault)`
  cursor: pointer;
  display: inline-flex;
  margin: 1px;

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
