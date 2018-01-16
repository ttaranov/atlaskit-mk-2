// @flow

import React from 'react';
import Avatar from '@atlaskit/avatar';
// $FlowFixMe: This is erroring because flow can't make sense of typescript files.
import { Editor } from '@atlaskit/editor-core'; // eslint-disable-line import/extensions
import avatarImg from './utils/sample-avatar.png';
import { CommentLayout } from '../src';

export default () => (
  <CommentLayout
    avatar={<Avatar src={avatarImg} label="User avatar" size="medium" />}
    content={
      <Editor appearance="comment" allowTextFormatting isExpandedByDefault />
    }
  />
);
