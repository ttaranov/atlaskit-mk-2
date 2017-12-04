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
import WithAllAvatarSizes from './with-all-avatar-sizes';
import type { AppearanceType } from '../src/types';

const AvatarInCol = props => (
  <AvatarCol>
    <Avatar {...props} />
  </AvatarCol>
);

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
      <AvatarInCol appearance={appearance} src={src} size="large" />
      <AvatarInCol
        appearance={appearance}
        src={src}
        size="large"
        presence="busy"
      />
      <AvatarInCol
        appearance={appearance}
        src={src}
        size="large"
        presence="focus"
      />
      <AvatarInCol
        appearance={appearance}
        src={src}
        size="large"
        presence="offline"
      />
      <AvatarInCol
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
    <WithAllAvatarSizes src={src} presence="online" />

    <HR />
    <h2>Status</h2>

    <h5>Status Types</h5>
    <Note>
      Supports &quot;approved&quot;, &quot;declined&quot;, and
      &quot;locked&quot;
    </Note>
    <AvatarRow>
      <AvatarInCol appearance={appearance} src={src} size="large" />
      <AvatarInCol
        appearance={appearance}
        src={src}
        size="large"
        status="approved"
      />
      <AvatarInCol
        appearance={appearance}
        src={src}
        size="large"
        status="declined"
      />
      <AvatarInCol
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
    <WithAllAvatarSizes appearance={appearance} src={src} status="approved" />
  </Wrapper>
);
