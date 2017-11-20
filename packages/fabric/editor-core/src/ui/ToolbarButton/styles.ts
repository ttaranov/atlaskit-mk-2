import styled from 'styled-components';
import AkButtonDefault from '@atlaskit/button';

// tslint:disable-next-line:variable-name
export const AkButton: any = styled(AkButtonDefault)`
  line-height: 0;
  justify-content: center;

  > span {
    margin: 0 ${props => props.spacing === 'none' ? '0' : '-2px'};
  }

  & + & {
    margin-left: ${props => props.spacing === 'none' ? '4px' : '-2px'};
  }
`;
