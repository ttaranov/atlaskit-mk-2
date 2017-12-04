// @flow
import React from 'react';
import type { Node } from 'react';
import { Note, Wrapper, HR } from '../examples-util/styled';
import Avatar from '../src/';
import { avatarUrl } from '../examples-util/constants';

const stackSourceURLs = [];
const avatarSize = 'large';

// eslint-disable-next-line no-plusplus
for (let i = 0; i < 20; i++) stackSourceURLs.push(i);

type ShowcaseProps = {
  children: Node,
  description: Node,
  title: string,
};

const AvatarShowcase = ({ children, description, title }: ShowcaseProps) => (
  <div style={{ alignItems: 'center', display: 'flex', marginBottom: '1em' }}>
    <div style={{ marginRight: '1em' }}>{children}</div>
    <div style={{ flex: 1 }}>
      <h5>{title}</h5>
      <Note>{description}</Note>
    </div>
  </div>
);

export default () => (
  <Wrapper>
    <h2>Interactive Avatars</h2>
    <Note size="large">
      For most instances you will no-longer need to wrap{' '}
      <code>{'<Avatar/>'}</code>.
    </Note>
    <AvatarShowcase
      title="Button"
      description={
        <span>
          Provide <code>onClick</code> to {'<Avatar/>'} or{' '}
          <code>onAvatarClick</code> to {'<AvatarGroup/>'}
        </span>
      }
    >
      <Avatar src={avatarUrl} onClick={console.info} size={avatarSize} />
    </AvatarShowcase>

    <AvatarShowcase
      title="Anchor"
      description={
        <span>
          Provide <code>href</code> to {'<Avatar/>'}. Also, optionally accepts a{' '}
          <code>target</code> property.
        </span>
      }
    >
      <Avatar
        href="http://atlaskit.atlassian.com"
        src={avatarUrl}
        size={avatarSize}
        target="_blank"
      />
    </AvatarShowcase>

    <AvatarShowcase
      title="Tooltip"
      description={
        <span>
          Provide <code>name</code> to {'<Avatar/>'}. Image receives alt-text
          and an aria-label, which describes the image to screenreaders.
        </span>
      }
    >
      <Avatar src={avatarUrl} name="Bill Murray" size={avatarSize} />
    </AvatarShowcase>

    <HR />

    <h5>Avatar States</h5>
    <Note>
      All states handled internal, thought can also be provided as props.
    </Note>
    <AvatarShowcase title="Default" description="No state applied">
      <Avatar src={avatarUrl} size="large" onClick={() => {}} label="default" />
    </AvatarShowcase>
    <AvatarShowcase
      title="isHover"
      description="akColorN70A applied as an overlay"
    >
      <Avatar src={avatarUrl} size="large" onClick={() => {}} isHover />
    </AvatarShowcase>
    <AvatarShowcase
      title="isActive"
      description="akColorN70A applied as an overlay, and scaled down to 90%"
    >
      <Avatar src={avatarUrl} size="large" onClick={() => {}} isActive />
    </AvatarShowcase>
    <AvatarShowcase
      title="isFocus"
      description="akColorB200 focus ring applied, border-width relative to avatar size"
    >
      <Avatar src={avatarUrl} size="large" onClick={() => {}} isFocus />
    </AvatarShowcase>
    <AvatarShowcase
      title="isSelected"
      description="akColorN200A applied as an overlay"
    >
      <Avatar src={avatarUrl} size="large" onClick={() => {}} isSelected />
    </AvatarShowcase>
    <AvatarShowcase
      title="isDisabled"
      description="70% white applied as an overlay"
    >
      <Avatar src={avatarUrl} size="large" onClick={() => {}} isDisabled />
    </AvatarShowcase>
  </Wrapper>
);
