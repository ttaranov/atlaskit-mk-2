import styled from 'styled-components';

export const imageMargin = 10;
export const RowWrapper = styled.div`
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
