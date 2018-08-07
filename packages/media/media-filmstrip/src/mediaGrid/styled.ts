import styled, { keyframes } from 'styled-components';

export const imageMargin = 10;

const fadeIn = keyframes`
  0% {
    width: 0;
  }
  100% {
    width: 14px;
  }
`;

export const Placeholder = styled.div`
  display: inline-block;
  box-sizing: border-box;
  border-left: 4px solid #4c9aff;
  animation: ${fadeIn} 0.2s forwards;
`;

export const RowWrapper = styled.div`
  position: relative;
  line-height: 0;
  margin-bottom: ${imageMargin}px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ImgWrapper = styled.div`
  display: inline-block;
  margin-right: ${imageMargin}px;
  position: relative;

  &:last-child {
    margin-right: 0;
  }
`;

export const Wrapper = styled.div``;
