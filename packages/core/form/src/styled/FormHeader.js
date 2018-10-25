// @flow
import styled from 'styled-components';
import { gridSize, typography } from '@atlaskit/theme';

/**
 * Provide a styled container for form headers.
 */
const FormHeaderWrapper = styled.div``;

/**
 * Provide a styled container for form header title.
 */
const FormHeaderTitle = styled.h1`
  ${typography.h700()};
  line-height: ${gridSize() * 4}px;
  margin-right: ${gridSize() * 4}px;
  margin-top: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/**
 * Provide a styled container for form header title.
 */
const FormHeaderDescription = styled.div`
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
