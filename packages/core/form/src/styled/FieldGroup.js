// @flow
import React from 'react';
import type { FieldGroupProps } from '../FieldGroup';
// import { gridSize, fontSize, colors, themed } from '@atlaskit/theme';

/**
 * Provide a styled container with fieldset as default.
 *
 */

const FieldGroupWrapper = (props: FieldGroupProps) => {
  // TODO: Once AK is using styled components 2+ the inline styles can be replaced with SCs
  // and setting attributess us styled.fieldset.attrs({})
  const style = {
    display: 'flex',
    flexDirection: props.layout,
    marginTop: '16px',
  };

  return (
    <fieldset style={style}>
      {props.children}
      <legend>{props.label}</legend>
    </fieldset>
  );
};

export default FieldGroupWrapper;
