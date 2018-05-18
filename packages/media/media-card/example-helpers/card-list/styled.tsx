import styled from 'styled-components';

export const CardListWrapper = styled.div`
  border: 1px solid black;
  overflow: 'hidden';
  ${({ width }: { width?: number }) => (width ? `width: ${width}px` : '')};
`;
