import * as React from 'react';
import * as Loadable from 'react-loadable';
import AvatarType from '@atlaskit/avatar';
import AvatarGroupType from '@atlaskit/avatar-group';
import AvatarsType from './avatars';

export const AvatarsLoader = Loadable.Map({
  loader: {
    Avatar: (): Promise<typeof AvatarType> =>
      import(/* webpackChunkName:"@atlaskit-internal-editor-avatar" */ '@atlaskit/avatar').then(
        module => module.default,
      ),
    AvatarGroup: (): Promise<typeof AvatarGroupType> =>
      import(/* webpackChunkName:"@atlaskit-internal-editor-avatarGroup" */ '@atlaskit/avatar-group').then(
        module => module.default,
      ),
    AvatarUI: (): Promise<typeof AvatarsType> =>
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
