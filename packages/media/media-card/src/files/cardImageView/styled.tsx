/* tslint:disable:variable-name */

import styled from 'styled-components';

import { ComponentClass } from 'react';
import { akColorN20, akColorB200 } from '@atlaskit/util-shared-styles';
import { Root, cardShadow } from '../../styles';
import { borderRadius, size } from '@atlaskit/media-ui';

export interface WrapperProps {
  disableOverlay?: boolean;
  selectable?: boolean;
  selected?: boolean;
  hasOnClick?: boolean;
  mediaType?: string;
}

const getShadowAttribute = (props: WrapperProps) => {
  const { disableOverlay } = props;
  return disableOverlay ? '' : cardShadow;
};

const getCursorAttribute = () => {
  // TODO MSW-661: Figure out pointer logic for image card component
  return 'cursor: pointer;';
};

const getBorderAttribute = (props: WrapperProps) => {
  const { selected, selectable } = props;
  return `border: 2px solid ${
    selected && selectable ? akColorB200 : 'transparent'
  };`;
};

const getBackgroundColor = (props: WrapperProps) => {
  const { mediaType } = props;
  return `background: ${mediaType === 'image' ? 'transparent' : akColorN20};`;
};

export const Wrapper: ComponentClass<WrapperProps> = styled(Root)`
  ${getShadowAttribute} ${getCursorAttribute} ${borderRadius} background: #fff;
  line-height: normal;
  position: relative;

  /*
   * Used to display the blue border around a selected card without
   * shrinking the image OR growing the card size
   */
  &::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    box-sizing: border-box;
    pointer-events: none;
    ${borderRadius} ${getBorderAttribute};
  }

  ${size()} .wrapper {
    ${borderRadius};
    ${getBackgroundColor};
    display: block;
    height: inherit;
    position: relative;

    .img-wrapper {
      position: relative;
      width: inherit;
      height: inherit;
      display: block;
      overflow: hidden;
      ${borderRadius}
    }
  }
`;

export const PlayIconWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  /* we want to override default icon size and hover state */
  &:hover > * {
    width: 64px;
    height: 64px;
  }

  > * {
    background: rgba(23, 43, 77, 0.7);
    width: 56px;
    height: 56px;
    border-radius: 100%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.1s;
  }
`;
