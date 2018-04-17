// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  ### Usage

  This package exports an number of different Avatar related components:

  - Avatar (Default Export)
  - [AvatarItem](/mk-2/packages/core/avatar/docs/avatar-item)
  - [AvatarGroup](/mk-2/packages/core/avatar/docs/avatar-group)
  - [Presence](/mk-2/packages/core/avatar/docs/presence)
  - [Status](/mk-2/packages/core/avatar/docs/status)
  - [Skeleton](/mk-2/packages/core/avatar/docs/skeleton)

  ## Avatar - Defult Export

  Use the \`Avatar\` component to represent users with their profile picture.
  Optionally, a presence to indicate online status can also be displayed.

  You can use the \`Presence\` component independently for contexts where the
  profile picture is not required (e.g. next to a username)

  ${(
    <Example
      Component={require('../examples/01-basicAvatar').default}
      title="Avatar"
      source={require('!!raw-loader!../examples/01-basicAvatar')}
    />
  )}

  ${(
    <Props
      heading="Avatar Props"
      props={require('!!extract-react-types-loader!../src/components/Avatar')}
    />
  )}
`;
