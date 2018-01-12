// @flow

import React from 'react';
import Avatar from '@atlaskit/avatar';
import { Editor } from '@atlaskit/editor-core';
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
