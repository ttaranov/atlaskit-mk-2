import styled from 'styled-components';
import { ImgHTMLAttributes, HTMLAttributes, ComponentClass } from 'react';
import { CardDimensions } from '../../index';
import { getCSSUnitValue } from '../../utils/getCSSUnitValue';
import { absolute, borderRadius, ellipsis, size } from '@atlaskit/media-ui';
import { colors } from '@atlaskit/theme';

export interface WrapperProps {
  readonly dimensions?: CardDimensions;
  readonly selected: boolean;
}

const getWrapperDimension = (
  key: keyof CardDimensions,
  dimensions?: CardDimensions,
) =>
  dimensions && dimensions[key]
    ? `${key}: ${getCSSUnitValue(dimensions[key]!)};`
    : '';

const selectedBorderSize = 2;
const getSelectedBorder = (selected: boolean) =>
  selected
    ? `
    border: ${selectedBorderSize}px solid ${colors.B100};
    margin: -${selectedBorderSize}px;
  `
    : '';

export const PreviewImage: ComponentClass<ImgHTMLAttributes<{}>> = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Wrapper: ComponentClass<
  HTMLAttributes<{}> & WrapperProps
> = styled.div`
  overflow: hidden;
  position: relative;
  font-weight: normal;
  font-size: 12px;
  ${({ dimensions, selected }: WrapperProps) => `
    ${getWrapperDimension('width', dimensions)}
    ${getWrapperDimension('height', dimensions)}
    ${getSelectedBorder(selected)}
  `} ${borderRadius};
`;

export const PreviewProgressBar: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  position: absolute;
  bottom: 12px;
  left: 8px;
  right: 8px;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  ${borderRadius};
`;
export const PreviewProgressBarInsert: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  height: 100%;
  background: ${colors.N0};
  ${borderRadius};
`;
export const Blanket: ComponentClass<HTMLAttributes<{}>> = styled.div`
  background: ${colors.N90A};
  ${absolute()}
  ${size()}
  ${borderRadius}
`;
export interface ButtonsProps {
  isHoverState: boolean;
}

export const ActionsWrapper: ComponentClass<
  HTMLAttributes<{}> & ButtonsProps
> = styled.div`
  position: absolute;
  right: 4px;
  top: 4px;

  ${({ isHoverState }: ButtonsProps) =>
    isHoverState
      ? `
    > button {
      padding: 0;
      height: auto;
      line-height: auto;
      background: ${colors.N0};
      margin-left: 4px;
      > span > span {
        margin: 0 !important;
      }
    }
  `
      : ''};
`;

export const PreviewMediaName: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: absolute;
  bottom: 22px;
  left: 8px;
  right: 8px;
  height: 16px;
  text-align: center;
  overflow: hidden;
  color: ${colors.N0};
  ${ellipsis()};
`;

export const PreviewButtomTextRow: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  position: absolute;
  bottom: 6px;
  left: 8px;
  right: 8px;
  height: 16px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: ${colors.N0};
  > span {
    margin-left: 2px;
  }
  > button {
    padding: 0 2px;
    color: ${colors.N0} !important;
    margin-top: -1px;
  }
`;

export const SpinnerWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  margin-right: 2px;
`;
