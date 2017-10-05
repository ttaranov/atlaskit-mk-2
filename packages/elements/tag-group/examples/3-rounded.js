// @flow
import React from 'react';
import Tag from '@atlaskit/tag';
import Avatar from '@atlaskit/avatar';
import TagGroup from '../src';

const tagNames = ['liquorice', 'bear-claw', 'croissant', 'cotton'];

export default () => (
  <TagGroup>
    {tagNames.map(sweet => (
      <Tag
        appearance="rounded"
        elemBefore={<Avatar size="xsmall" />}
        href="http://www.cupcakeipsum.com/"
        key={sweet}
        text={sweet}
        removeButtonText="remove"
      />
    ))}
  </TagGroup>
);
