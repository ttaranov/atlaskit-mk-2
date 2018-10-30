import styled from 'styled-components';

export const ImageComponent = styled.img`
  max-width: none !important; // This to override unexpected css coming from Prose mirror
  position: absolute;
  left: 50%;
  top: 50%;
`;
