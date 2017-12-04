// @flow
import React from 'react';
import Avatar from '../src/';
import { AvatarRow, AvatarCol } from './styled';
import { omit } from '../src/utils';
import type { AvatarPropTypes } from '../src/types';

export default (props: AvatarPropTypes) => {
  const modifiedProps = omit(props, 'presence', 'status');
  return (
    <AvatarRow>
      <AvatarCol>
        <Avatar size="xxlarge" {...modifiedProps} />
      </AvatarCol>
      <AvatarCol>
        <Avatar size="xlarge" {...props} />
      </AvatarCol>
      <AvatarCol>
        <Avatar size="large" {...props} />
      </AvatarCol>
      <AvatarCol>
        <Avatar size="medium" {...props} />
      </AvatarCol>
      <AvatarCol>
        <Avatar size="small" {...props} />
      </AvatarCol>
      <AvatarCol>
        <Avatar size="xsmall" {...modifiedProps} />
      </AvatarCol>
    </AvatarRow>
  );
};
