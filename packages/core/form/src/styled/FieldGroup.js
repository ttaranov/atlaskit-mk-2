// @flow
import React from 'react';
import styled from 'styled-components';
import { typography } from '@atlaskit/theme';
import Field from './Field';
import type { FieldGroupProps } from '../FieldGroup';
// import { gridSize, fontSize, colors, themed } from '@atlaskit/theme';

/**
 * Provide a styled container with fieldset as default.
 *
 */

const FieldSet = styled.fieldset`
  display: flex;
  flex-direction: ${p => p.layout};
  margin-top: 8px;

  > ${Field} {
    margin-top: 0;
  }

  > legend {
    ${typography.h200()} display: inline-block;
    margin: 0 0 4px 0;
    padding: 0;
  }
`;

const FieldGroupWrapper = (props: FieldGroupProps) => {
  return (
    <FieldSet layout={props.layout}>
      {props.label && <legend>{props.label}</legend>}
      {props.children}
    </FieldSet>
  );
};

export default FieldGroupWrapper;
