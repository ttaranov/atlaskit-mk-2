import styled from 'styled-components';

const ImageComponent = styled.img`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const FitImageComponent = styled(ImageComponent)`
  max-height: 100%;
  max-width: 100%;
`;

export const CoverVerticalImageComponent = styled(ImageComponent)`
  max-width: 100%;
`;

export const CoverHorizontalImageComponent = styled(ImageComponent)`
  max-height: 100%;
`;
