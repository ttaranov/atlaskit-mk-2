/* tslint:disable:variable-name */

import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import { Href, HrefProps } from '../../utils/href';

export const A: ComponentClass<HTMLAttributes<{}> & HrefProps> = styled(Href)`
  color: initial;

  /* !important is required to override @atlaskit/renderer styles */
  text-decoration: none !important;
`;
