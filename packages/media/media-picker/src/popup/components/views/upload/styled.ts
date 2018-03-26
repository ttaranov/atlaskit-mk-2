import styled from 'styled-components';

import { HTMLAttributes, ImgHTMLAttributes, ComponentClass } from 'react';
import { borderIcon } from '../../../../icons';

export interface IsEmptyProps {
  isEmpty?: boolean;
}

export const SpinnerWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  height: calc(100% - 235px);
`;

export const DefaultImage: ComponentClass<ImgHTMLAttributes<{}>> = styled.img`
  float: left;
  width: 115px;
`;

export const TextWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  float: left;
`;

export const DropzoneText: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: block;
  margin-left: 10px;
  white-space: nowrap;
  margin-top: 15px;
  color: #6c798f;
`;

export const ButtonWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  margin-left: 10px;
  margin-top: 14px;
  text-align: center;
`;

export const DropzoneContentWrapper: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  display: block;
  float: left;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const DropzoneContainer: ComponentClass<
  HTMLAttributes<{}> & IsEmptyProps
> = styled.div`
  border: 2px dashed #cfd4db;
  border-image-source: url('${borderIcon}');
  border-image-slice: 2;
  border-image-repeat: round;
  border-radius: 3px;
  ${({ isEmpty }: IsEmptyProps) =>
    isEmpty ? 'height: calc(100% - 4px);' : 'height: 235px;'}
`;

export const RecentUploadsTitle: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  padding: 25px 10px 5px 0;
  font-size: 20px;
  color: #071d43;
  grid-column-end: 5;
  grid-column-start: 1;
`;

export const CardsWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 12px;
  grid-template-columns: 162px 162px 162px 162px;
`;

export const Wrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: white;
  padding: 24px 24px 2px 24px;
`;
