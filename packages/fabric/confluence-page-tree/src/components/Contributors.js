// @flow
import React from 'react';
import Avatar, { AvatarGroup } from '@atlaskit/avatar';
import { AkProfilecardTrigger, AkProfileClient } from '@atlaskit/profilecard';

const AvatarWithProfileCard = props => {
  const { userId, username, cloudId } = props;

  const profileClient = new AkProfileClient({
    url: 'https://api-private.stg.atlassian.com/directory/graphql', //TODO: need to make it configurable for stg/prod
  });

  const redirectToProfilePage = () => {
    window.location.href = `/wiki/display/~${username}`;
  };

  return (
    <AkProfilecardTrigger
      cloudId={cloudId}
      userId={userId}
      resourceClient={profileClient}
      actions={[
        {
          label: 'View profile', //TODO: How to i18n?
          callback: redirectToProfilePage,
        },
      ]}
    >
      <Avatar isHover={false} {...props} />
    </AkProfilecardTrigger>
  );
};

const Contributors = props => {
  const data = props.contributors.publishers.users.map(user => {
    return {
      name: user.displayName,
      size: 'medium',
      src: user.profilePicture.path,
      userId: user.accountId,
      username: user.username,
    };
  });

  return (
    <div style={{ maxWidth: 270 }}>
      <AvatarGroup
        appearance="stack"
        onAvatarClick={console.log} //TODO: change this
        data={data}
        avatar={AvatarWithProfileCard}
        size="large" //TODO: check this
        maxCount={3}
      />
    </div>
  );
};

export { Contributors };
