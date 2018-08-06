import styled from 'styled-components';

export const imageMargin = 10;
export const RowWrapper = styled.div`
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

export interface PlaceholderProps {
  isDragging: boolean;
}

export const LeftPlaceholder = styled.div`
  pointer-events: ${({ isDragging }: PlaceholderProps) =>
    isDragging ? 'all' : 'none'};
  /* background: red; */
  position: absolute;
  opacity: ${({ isDragging }: PlaceholderProps) => (isDragging ? '.6' : '.3')};
  width: calc(50% + 5px);
  height: 100%;
  left: -5px;
  top: 0;
`;

export const RightPlaceholder = styled.div`
  pointer-events: ${({ isDragging }: PlaceholderProps) =>
    isDragging ? 'all' : 'none'};
  background: blue;
  position: absolute;
  opacity: ${({ isDragging }: PlaceholderProps) => (isDragging ? '.6' : '.3')};
  width: calc(50% + 5px);
  height: 100%;
  right: -5px;
  top: 0;
`;

export const Wrapper = styled.div``;
