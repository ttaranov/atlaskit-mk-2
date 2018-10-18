import * as React from 'react';
import * as Loadable from 'react-loadable';
import AvatarType from '@atlaskit/avatar';
import AvatarGroupType from '@atlaskit/avatar-group';
import AvatarsType, { Props } from './avatars';

export const AvatarsLoader = Loadable.Map<
  Partial<Props>,
  {
    AvatarUI: typeof AvatarsType;
    AvatarGroup: typeof AvatarGroupType;
    Avatar: typeof AvatarType;
  }
>({
  loader: {
    Avatar: () =>
      import(/* webpackChunkName:"@atlaskit-internal-editor-avatar" */ '@atlaskit/avatar').then(
        module => module.default,
      ),
    AvatarGroup: () =>
      import(/* webpackChunkName:"@atlaskit-internal-editor-avatarGroup" */ '@atlaskit/avatar-group').then(
        module => module.default,
      ),
    AvatarUI: () =>
      import(/* webpackChunkName:"@atlaskit-internal-editor-avatars" */ './avatars').then(
        module => module.default,
      ),
  },
  loading: () => null,
  render(loaded, props) {
    const { AvatarUI, AvatarGroup, Avatar } = loaded;

    return <AvatarUI {...props} AvatarGroup={AvatarGroup} Avatar={Avatar} />;
  },
});
