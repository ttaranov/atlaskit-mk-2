import styled from 'styled-components';
import AkButtonDefault from '@atlaskit/button';

// tslint:disable-next-line:variable-name
export const AkButton: any = styled(AkButtonDefault)`
  & + & {
    margin-left: 4px;
  }
`;
