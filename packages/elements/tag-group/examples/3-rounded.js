// @flow
import React from 'react';
import Tag from '@atlaskit/tag';
import TagGroup from '../src';
import Avatar from '@atlaskit/avatar';

const tagNames = ['liquorice', 'bear-claw', 'croissant', 'cotton'];

export default () => (
  <TagGroup>
    {tagNames.map((sweet, i) => (
      <Tag
        appearance="rounded"
        elemBefore={<Avatar size="xsmall" />}
        href="http://www.cupcakeipsum.com/"
        key={i}
        text={sweet}
        removeButtonText="remove"
      />
    ))}
  </TagGroup>
);
