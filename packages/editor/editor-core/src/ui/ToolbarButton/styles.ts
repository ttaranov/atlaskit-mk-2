import styled from 'styled-components';
import AkButtonDefault from '@atlaskit/button';

interface ButtonProps {
  spacing: string;
}

// tslint:disable-next-line:variable-name
export const AkButton: any = styled(AkButtonDefault)`
  line-height: 0;
  justify-content: center;

  > span {
    margin: 0
      ${(props: ButtonProps) => (props.spacing === 'none' ? '0' : '-2px')};
  }

  & + & {
    margin-left: ${(props: ButtonProps) =>
      props.spacing === 'none' ? '4px' : '0px'};
  }

  &[disabled] {
    pointer-events: none;
  }
`;
