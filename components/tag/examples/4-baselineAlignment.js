// @flow
import * as React from 'react';
import Tag from '@atlaskit/tag';

const cupcakeipsum = 'Croissant topping tiramisu gummi bears. Bonbon chocolate bar danish soufflé';

export default () => {
  return (
    <Tag
      text={cupcakeipsum}
      removeButtonText="No sweets for you!"
      href="http://www.cupcakeipsum.com/"
    />
  );
};
