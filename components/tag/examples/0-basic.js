// @flow
import * as React from 'react';
import Tag from '../src';
import Avatar from '@atlaskit/avatar';

export default () => (
  <div>
    <Tag text="Base Tag" />
    <Tag text="Avatar Before" elemBefore={<Avatar size="xsmall" />} />
    <Tag text="Linked Tag" href="/components/tag" />
    <Tag text="Rounded Tag" appearance="rounded" />
    <Tag text="Removable button" removeButtonText="Aria label" />
    <Tag
      text="Removal halted"
      removeButtonText="Aria label"
      onBeforeRemoveAction={() => {
        console.log('Removal halted');
        return false;
      }}
    />
    <Tag
      text="Post Removal Hook"
      removeButtonText="Aria label"
      onBeforeRemoveAction={() => {
        console.log('Before removal');
        return true;
      }}
      onAfterRemoveAction={e => console.log('After removal', e)}
    />
  </div>
);
