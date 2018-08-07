import styled from 'styled-components';

export const imageMargin = 10;

export const RowWrapper = styled.div`
  position: relative;
  line-height: 0;
  margin-bottom: ${imageMargin}px;

  &:last-child {
    margin-bottom: 0;
  }
`;

interface ImgWrapperProps {
  hasPlaceholder: boolean;
  isRightPlaceholder: boolean;
}
export const ImgWrapper = styled.div`
  transition: margin-left 0.2s, padding-left 0.2s, margin-right 0.2s,
    padding-right 0.2s;
  ${(props: ImgWrapperProps) =>
    props.hasPlaceholder
      ? props.isRightPlaceholder
        ? `
    padding-right: 14px;
    border-right: 4px solid #4c9aff;
  `
        : `
    padding-left: 14px;
    border-left: 4px solid #4c9aff;
  `
      : `
    padding-left: 0;
    border-left: 0;
  `};
  display: inline-block;
  margin-right: ${imageMargin}px;
  position: relative;
  background-color: #ecf0f8;

  &:last-child {
    margin-right: 0;
  }
`;

export const Wrapper = styled.div``;
