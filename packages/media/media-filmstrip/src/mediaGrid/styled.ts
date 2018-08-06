import styled from 'styled-components';

export const imageMargin = 10;

export const Placeholder = styled.div`
  display: inline-block;
  box-sizing: border-box;
  width: 10px;
  border-left: 2px solid #49e849;
`;

export const RowWrapper = styled.div`
  position: relative;
  line-height: 0;
  margin-bottom: ${imageMargin}px;

  &:last-child {
    margin-bottom: 0;
  }

  img {
    margin-right: ${imageMargin}px;

    &:last-child {
      margin-right: 0;
    }
  }
`;
