// @flow
import React from 'react';
import Avatar from '@atlaskit/avatar';
import Tag from '../src';

export default () => (
  <Tag
    shape="rounded"
    elemBefore={<Avatar size="xsmall" />}
    text="Default Avatar"
    removeButtonText="Remove me"
  />
);
