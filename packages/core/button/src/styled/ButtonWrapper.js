// @flow

import React, { type Node } from 'react';

type Props = {
  onClick: (e: Event) => mixed,
  fit: boolean,
  children: Node,
};

type styleObj = {
  alignSelf: string,
  display: string,
  flexWrap: string,
  maxWidth: string,
  width?: string,
  justifyContent?: string,
};

const ButtonWrapper = (props: Props) => {
  const style: styleObj = {
    alignSelf: 'center',
    display: 'inline-flex',
    flexWrap: 'nowrap',
    maxWidth: '100%',
    position: 'relative',
  };
  if (props.fit) {
    style.width = '100%';
    style.justifyContent = 'center';
  }

  const optionalProps = {};
  if (props.onClick) {
    optionalProps.onClick = props.onClick;
  }
  return (
    <span style={style} {...optionalProps}>
      {props.children}
    </span>
  );
};

export default ButtonWrapper;
