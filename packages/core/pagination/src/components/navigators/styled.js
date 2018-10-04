//@flow
import styled from 'styled-components';
import Button from '@atlaskit/button';

export const PaddedButton = styled(Button)`
  padding: ${({ styles }) =>
    styles && styles.padding ? styles.padding : '4px 0'};
`;
