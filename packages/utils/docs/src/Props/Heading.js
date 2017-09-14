import React from 'react';
import PropTypes from 'prop-types';

const style = {
  h1: {
    marginTop: 0,
  },
  h2: {
    marginTop: '1em',
  },
  h3: {
    marginTop: '1em',
  },
};

export default function Heading(
  { children, level = 1 }:
  {
    children: PropTypes.node.isRequired,
    level: PropTypes.number,
  }
) {
  const Tag = `h${level}`;

  return (
    <Tag style={style[Tag]}>
      {children}
    </Tag>
  );
}

export const H1 = props => <Heading level={1} {...props} />;
export const H2 = props => <Heading level={2} {...props} />;
export const H3 = props => <Heading level={3} {...props} />;
