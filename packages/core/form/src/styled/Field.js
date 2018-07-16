// @flow
import styled from 'styled-components';
import { typography } from '@atlaskit/theme';

/**
 * Provide a styled container for field components
 */
const FieldWrapper = styled.div`
  padding-top: 8px;
`;

/**
 * Provide a styled Label for field components
 */
export const Label = styled.label`
  ${typography.h200()} display: inline-block;
  margin-bottom: 4px;
  margin-top: 0;
`;

/**
 * Label can appear before or after
 */
/**
 * Provide a styled container for field components
 */
export const HelperText = styled.span`
  ${typography.h200()} font-weight: normal;
  margin-top: 8px;
`;

export default FieldWrapper;
