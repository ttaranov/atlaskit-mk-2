/* tslint:disable:variable-name */
import styled from 'styled-components';
import { Href, HrefProps } from '../../utils/href';

export const A = styled(Href)`
  color: initial;

  /* !important is required to override @atlaskit/renderer styles */
  text-decoration: none !important;
  /* We need to do this to make TS happy */
  ${(props: HrefProps) => ''};
`;
