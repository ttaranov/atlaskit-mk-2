/* tslint:disable:variable-name */

import styled from 'styled-components';
import { Href } from '../../utils/href';

export const A: any = styled(Href)`
  color: initial;

  /* !important is required to override @atlaskit/renderer styles */
  text-decoration: none !important;
`;
