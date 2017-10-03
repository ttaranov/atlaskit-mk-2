// @flow
import React from 'react';
import Example from './example';

type Props = {
  match: {
    params: {
      example: string,
    },
  },
};

export default function Pattern(props: Props) {
  return (
    <Example match={{
      params: {
        group: '',
        name: 'patterns',
        example: props.match.params.example,
      },
    }}/>
  );
};
