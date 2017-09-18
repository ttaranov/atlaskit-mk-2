import React from 'react';
import PropTypes from 'prop-types';

export default function ReadmeDescription(
  { children }:
  { children: PropTypes.node }
) {
  const style = { marginTop: 12 };

  return typeof children === 'string'
    ? <p>{children}</p>
    : <div style={style}>{children}</div>;
}
