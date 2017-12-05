import styled from 'styled-components';
import { borderRadius, size } from '../../styles';

export interface ImageProps {
  src: string;
}

export const Image = styled.div`
  ${borderRadius} ${size(32)}
  background-image: url(${({ src }: ImageProps) => src});
  background-size: cover;
`;
