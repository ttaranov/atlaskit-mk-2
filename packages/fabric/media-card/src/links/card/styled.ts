/* tslint:disable:variable-name */
import styled from 'styled-components';
import { Href, HrefProps } from '../../utils/href';

export const A = styled(Href)`
  color: initial;
  // We need to do this to make TS happy
  ${(props: HrefProps) => ''};
`;
