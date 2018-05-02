// @flow

import React, { type Node } from 'react';

type Props = {
  onClick: (e: Event) => mixed,
  fit: boolean,
  isLoading: boolean,
  children: Node,
};

type styleObj = {
  alignSelf: string,
  display: string,
  flexWrap: string,
  maxWidth: string,
  width?: string,
  justifyContent?: string,
  opacity?: number,
};

const ButtonWrapper = (props: Props) => {
  const style: styleObj = {
    alignSelf: 'center',
    display: 'inline-flex',
    flexWrap: 'nowrap',
    maxWidth: '100%',
    transition: 'opacity 0.3s',
  };
  if (props.fit) {
    style.width = '100%';
    style.justifyContent = 'center';
  }

  if (props.isLoading) {
    style.opacity = 0;
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
