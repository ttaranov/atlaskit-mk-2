import styled from 'styled-components';

export const BlurredWrapper = styled.div`
  filter: blur(4px);
`;

export const SpinnerWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
