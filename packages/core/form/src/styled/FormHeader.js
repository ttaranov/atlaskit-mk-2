// @flow
import styled from 'styled-components';
import { fontSize } from '@atlaskit/theme';
import {
  akTypographyMixins,
  akGridSizeUnitless,
} from '@atlaskit/util-shared-styles';

/**
 * Provide a styled container for form headers.
 */
const FormHeaderWrapper = styled.div``;

/**
 * Provide a styled container for form header title.
 */
const FormHeaderTitle = styled.h1`
  ${akTypographyMixins.h700};
  line-height: ${akGridSizeUnitless * 4}px;
  margin-right: ${akGridSizeUnitless * 4}px;
  margin-top: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/**
 * Provide a styled container for form header title.
 */
const FormHeaderDescription = styled.span`
  font-size: ${fontSize()};
  margin-top: 8px;
`;

/**
 * Provide a styled container for form header content.
 */
const FormHeaderContent = styled.div`
  min-width: 100%;
  margin-top: 8px;
`;

export default FormHeaderWrapper;
export { FormHeaderTitle, FormHeaderDescription, FormHeaderContent };
