// @flow
import React from 'react';
import type { AvatarPropTypes } from '../src/types';
import { omit } from '../src/utils';
import { AvatarRow, AvatarCol } from './styled';
import Avatar from '../src';

export const DefaultAvatar = (props: AvatarPropTypes) => (
  <AvatarCol>
    <Avatar {...props} />
  </AvatarCol>
);

export const AllAvatarSizes = (props: AvatarPropTypes) => {
  // avoid warnings from invalid sizes
  const modifiedProps = omit(props, 'presence', 'status');
  return (
    <AvatarRow>
      <DefaultAvatar size="xxlarge" {...modifiedProps} />
      <DefaultAvatar size="xlarge" {...props} />
      <DefaultAvatar size="large" {...props} />
      <DefaultAvatar size="medium" {...props} />
      <DefaultAvatar size="small" {...props} />
      <DefaultAvatar size="xsmall" {...modifiedProps} />
    </AvatarRow>
  );
};
