// @flow
import * as React from 'react';
import Tag from '@atlaskit/tag';
import TagGroup from '@atlaskit/tag-group';

export default () => {
  return (
    <div>
      <p>Try tabbing :)</p>
      <TagGroup>
        <Tag href="http://www.cupcakeipsum.com/" removeButtonText="No sweets for you!" text="Danish chocolate" />
        <Tag href="http://www.cupcakeipsum.com/" removeButtonText="No sweets for you!" text="Jelly beans" />
        <Tag href="http://www.cupcakeipsum.com/" removeButtonText="No sweets for you!" text="Cheesecake" />
      </TagGroup>
    </div>
  );
};
