import styled from 'styled-components';
import { borderRadius, size as csssize } from '../../styles';

export interface ImageProps {
  size: number;
}

export const Image = styled.img`
  ${({ size }: ImageProps) => csssize(size)} ${borderRadius};

  /* hide the alt text when the image cannot be found */
  overflow: hidden;
`;
