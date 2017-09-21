import React from 'react';
import Example from './example';

type Props = {
  match: Object,
};

export default ({ match }: Props) => (
  <Example
    match={{
      ...match,
      ...{
        params: {
          ...match.params,
          ...{
            group: '',
            name: 'patterns',
            example: match.params.example,
          },
        },
      },
    }}
  />
);
