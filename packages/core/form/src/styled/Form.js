// @flow
import styled from 'styled-components';
// import { gridSize, fontSize, colors, themed } from '@atlaskit/theme';
/*
* TODO: Implement using SC 2+ attrs and properly handle:
* - inline
* - full page
* - within Modal Dialog
*/

/**
 * Provide a styled container with form as default.
 */
const FormWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`;

/**
 * Provide a styled container with form as default.
 */
const FormContent = styled.form``;

export default FormWrapper;
export { FormContent };
