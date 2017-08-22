// @flow
import * as React from 'react';
import Avatar from '@atlaskit/avatar';
import Tag from '@atlaskit/tag';

export default () => {
  return (
    <Tag
      appearance="rounded"
      elemBefore={<Avatar size="xsmall" />}
      text="Default Avatar"
      removeButtonText="Remove me"
    />
  );
};
