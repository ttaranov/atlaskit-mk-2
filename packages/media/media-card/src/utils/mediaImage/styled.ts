/* tslint:disable:variable-name */
import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { size, fadeIn } from '@atlaskit/media-ui';

export interface ImageViewWrapperProps {
  shouldFadeIn?: boolean;
  shouldCrop?: boolean;
}

const getBackgroundSize = ({ shouldCrop }: ImageViewWrapperProps) =>
  shouldCrop ? 'cover, auto' : 'contain, auto';

const shouldFadeIn = ({ shouldFadeIn }: ImageViewWrapperProps) =>
  shouldFadeIn ? fadeIn : '';

export const ImageViewWrapper: ComponentClass<
  HTMLAttributes<{}> & ImageViewWrapperProps
> = styled.div`
  ${size()} background-repeat: no-repeat, repeat;
  background-position: center, center;
  background-size: ${getBackgroundSize};
  ${shouldFadeIn};
`;
