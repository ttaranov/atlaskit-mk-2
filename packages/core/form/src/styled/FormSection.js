// @flow
import styled from 'styled-components';
import { gridSize, typography } from '@atlaskit/theme';

/**
 * Provide a styled container for form sections.
 */
const FormSectionWrapper = styled.div`
  margin-top: 24px;
`;

/**
 * Provide a styled container for form section title
 */
const FormSectionTitle = styled.h2`
  ${typography.h600()};
  line-height: ${gridSize() * 4}px;
  margin-right: ${gridSize() * 4}px;
  margin-top: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/**
 * Provide a styled container for form section content.
 */
const FormSectionDescription = styled.div`
  margin-top: 8px;
`;

/**
 * Provide a styled container for form section content.
 */
const FormSectionContent = styled.div``;

export default FormSectionWrapper;
export { FormSectionTitle, FormSectionDescription, FormSectionContent };
