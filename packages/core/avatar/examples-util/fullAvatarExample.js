// @flow
import React from 'react';
import { gridSize } from '@atlaskit/theme';
import Avatar from '../src/';
import WithAllAvatarSizes from './withAllAvatarSizes';
import { Block, Code, Note } from '../examples-util/helpers';
import type { AppearanceType } from '../src/types';

export default ({
  appearance,
  src,
}: {
  appearance: AppearanceType,
  src: string,
}) => (
  <div>
    <h2>Default appearance</h2>
    <Note>
      <Code>medium</Code> size - no <Code>presence</Code>, or
      <Code>status</Code>
    </Note>
    <div style={{ marginTop: gridSize() }}>
      <Avatar appearance={appearance} />
    </div>

    <h2>Presence</h2>
    <h4>Presence Types</h4>
    <Note>
      Supports <Code>busy</Code>, <Code>focus</Code>, <Code>offline</Code>, and
      <Code>online</Code>
    </Note>
    <Block>
      <Avatar appearance={appearance} src={src} size="large" />
      <Avatar appearance={appearance} src={src} size="large" presence="busy" />
      <Avatar appearance={appearance} src={src} size="large" presence="focus" />
      <Avatar
        appearance={appearance}
        src={src}
        size="large"
        presence="offline"
      />
      <Avatar
        appearance={appearance}
        src={src}
        size="large"
        presence="online"
      />
    </Block>

    <h4>All Sizes with Presence</h4>
    <Note>
      Sizes <Code>xsmall</Code> and <Code>xxlarge</Code> do NOT support Presence
    </Note>
    <WithAllAvatarSizes src={src} presence="online" />

    <h2>Status</h2>
    <h4>Status Types</h4>
    <Note>
      Supports <Code>approved</Code>, <Code>declined</Code>, and
      <Code>locked</Code>
    </Note>
    <Block>
      <Avatar appearance={appearance} src={src} size="large" />
      <Avatar
        appearance={appearance}
        src={src}
        size="large"
        status="approved"
      />
      <Avatar
        appearance={appearance}
        src={src}
        size="large"
        status="declined"
      />
      <Avatar appearance={appearance} src={src} size="large" status="locked" />
    </Block>

    <h4>All Sizes with Status</h4>
    <Note>
      Sizes <Code>xsmall</Code> and <Code>xxlarge</Code> do NOT support Status
    </Note>
    <WithAllAvatarSizes appearance={appearance} src={src} status="approved" />
  </div>
);
