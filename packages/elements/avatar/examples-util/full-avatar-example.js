// @flow
import React from 'react';
import {
  Wrapper,
  AvatarCol,
  Note,
  AvatarRow,
  HR,
} from '../examples-util/styled';
import Avatar from '../src/';
import { omit } from '../src/utils';
import type { AppearanceType, AvatarPropTypes } from '../src/types';

const DefaultAvatar = props => (
  <AvatarCol>
    <Avatar {...props} />
  </AvatarCol>
);
const AllAvatarSizes = (props: AvatarPropTypes) => {
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

export default ({
  appearance,
  src,
}: {
  appearance: AppearanceType,
  src: string,
}) => (
  <Wrapper>
    <h5>Default</h5>
    <Note>
      &quot;medium&quot; size &mdash; no &quot;presence&quot;, or
      &quot;status&quot;
    </Note>
    <Avatar appearance={appearance} />

    <HR />
    <h2>Presence</h2>

    <h5>Presence Types</h5>
    <Note>
      Supports &quot;busy&quot;, &quot;focus&quot;, &quot;offline&quot;, and
      &quot;online&quot;
    </Note>
    <AvatarRow>
      <DefaultAvatar appearance={appearance} src={src} size="large" />
      <DefaultAvatar
        appearance={appearance}
        src={src}
        size="large"
        presence="busy"
      />
      <DefaultAvatar
        appearance={appearance}
        src={src}
        size="large"
        presence="focus"
      />
      <DefaultAvatar
        appearance={appearance}
        src={src}
        size="large"
        presence="offline"
      />
      <DefaultAvatar
        appearance={appearance}
        src={src}
        size="large"
        presence="online"
      />
    </AvatarRow>

    <h5>All Sizes with Presence</h5>
    <Note>
      Sizes &quot;xsmall&quot; and &quot;xxlarge&quot; do NOT support Presence
    </Note>
    <AllAvatarSizes src={src} presence="online" />

    <HR />
    <h2>Status</h2>

    <h5>Status Types</h5>
    <Note>
      Supports &quot;approved&quot;, &quot;declined&quot;, and
      &quot;locked&quot;
    </Note>
    <AvatarRow>
      <DefaultAvatar appearance={appearance} src={src} size="large" />
      <DefaultAvatar
        appearance={appearance}
        src={src}
        size="large"
        status="approved"
      />
      <DefaultAvatar
        appearance={appearance}
        src={src}
        size="large"
        status="declined"
      />
      <DefaultAvatar
        appearance={appearance}
        src={src}
        size="large"
        status="locked"
      />
    </AvatarRow>

    <h5>All Sizes with Status</h5>
    <Note>
      Sizes &quot;xsmall&quot; and &quot;xxlarge&quot; do NOT support Status
    </Note>
    <AllAvatarSizes appearance={appearance} src={src} status="approved" />
  </Wrapper>
);
