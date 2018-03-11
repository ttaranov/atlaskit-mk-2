// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  ### Usage

  This package exports an number of different Avatar related components

  ~~~js
  import Avatar, {
    AvatarGroup,
    AvatarItem,
    Presence,
    Status,
    Skeleton,
  } from '@atlaskit/avatar';
  ~~~

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
    <Example
      Component={require('../examples/02-basicAvatarGroup').default}
      title="AvatarGroup"
      source={require('!!raw-loader!../examples/02-basicAvatarGroup')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/03-basicAvatarItem').default}
      title="Presence"
      source={require('!!raw-loader!../examples/03-basicAvatarItem')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/04-basicPresence').default}
      title="Presence"
      source={require('!!raw-loader!../examples/04-basicPresence')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/05-basicStatus').default}
      title="Status"
      source={require('!!raw-loader!../examples/05-basicStatus')}
    />
  )}

  ## Base Props

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Avatar')}
    />
  )}

  ## Avatar Item Props

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/AvatarItem')}
    />
  )}

## Presence Props

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Presence')}
    />
  )}

  ## Status Props

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Status')}
    />
  )}
  
  ## Skeleton Props

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Skeleton')}
    />
  )}

`;

// ## Avatar Group Props
//
//   ${(
//     <Props
//       props={require('!!extract-react-types-loader!../src/components/AvatarGroup')}
//     />
//   )}
