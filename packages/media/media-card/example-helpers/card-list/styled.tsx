import styled, { StyledComponentClass } from 'styled-components';

export const CardListWrapper: StyledComponentClass<
  { width?: number },
  {}
> = styled.div`
  border: 1px solid black;
  overflow: 'hidden';
  ${({ width }: { width?: number }) => (width ? `width: ${width}px` : '')};
`;
