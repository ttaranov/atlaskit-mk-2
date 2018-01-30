// @flow
/* eslint-disable react/no-array-index-key */
import React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import Lozenge from '@atlaskit/lozenge';
import Tooltip from '@atlaskit/tooltip';
import Avatar from '../src/';
import AvatarItem from '../src/components/AvatarItem';
import { Code, Note } from '../examples-util/helpers';
import { RANDOM_USERS, getAdorableAvatar } from '../examples-util/data';

const user = {
  ...RANDOM_USERS[0],
  avatarUrl: getAdorableAvatar(RANDOM_USERS[0].email),
};

const irregularUser = {
  name:
    'Sed vel augue sit amet sapien elementum bibendum. Aenean aliquam elementum dui, quis euismod metus ultrices ut. Cras aliquam augue at maximus egestas. Mauris ornare quis felis at luctus. Aenean rhoncus pellentesque commodo.',
  email:
    'sed-vel-augue-sit-amet-sapien-elementum-bibendum-aenean-aliquam-elementum-dui-quis-euismod-metus-ultrices-ut-cras-aliquam-augue-at-maximus-egestas-mauris-ornare-quis-felis-at-luctus-aenean-rhoncus-pellentesque-commodo@example.com',
  avatarUrl: getAdorableAvatar(RANDOM_USERS[1].email),
};

type State = {|
  placement:
    | 'content'
    | 'beforePrimaryText'
    | 'afterPrimaryText'
    | 'beforeSecondaryText'
    | 'afterSecondaryText',
|};

export default class MoreOnAvatarItemExample extends React.Component<*, State> {
  state = {
    placement: 'afterPrimaryText',
  };

  render() {
    return (
      <div>
        <h2>
          More on <Code>AvatarItem</Code>
        </h2>
        <Note>
          You can pass additional content to <Code>{'<AvatarItem/>'}</Code> via{' '}
          <Code>children</Code> prop. For example you can pass a{' '}
          <Code>{'<Lozenge/>'}</Code> item:
        </Note>
        <Note>
          Content placement will depend on the <Code>childrenPlacement</Code>{' '}
          value. Try toggling this state with these buttons to see how that
          affects the component.
        </Note>
        <Note>
          Current placement: <Code>{`"${this.state.placement}"`}</Code>
          <div>
            <ButtonGroup>
              {[
                'content',
                'beforePrimaryText',
                'afterPrimaryText',
                'beforeSecondaryText',
                'afterSecondaryText',
              ].map(v => (
                <Button
                  onClick={() => this.setState({ placement: v })}
                  isSelected={this.state.placement === v}
                >
                  {v}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        </Note>
        <AvatarItem
          avatar={<Avatar name={user.name} src={user.avatarUrl} />}
          primaryText={user.name}
          secondaryText={user.email}
          childrenPlacement={this.state.placement}
        >
          <Lozenge>Teammate</Lozenge>
        </AvatarItem>
        <Note>
          <Code>{'<AvatarItem/>'}</Code> supports truncation of long content via{' '}
          <Code>enableTextTruncate</Code> property which is set to{' '}
          <Code>true</Code> by default.
        </Note>
        <AvatarItem
          avatar={
            <Avatar name={irregularUser.name} src={irregularUser.avatarUrl} />
          }
          primaryText={irregularUser.name}
          secondaryText={irregularUser.email}
          childrenPlacement={this.state.placement}
        >
          <Lozenge>Teammate</Lozenge>
          <Tooltip
            tag="span"
            content="This user hasn't been active since <DATE>"
          >
            <Lozenge appearance="removed">On vacation?</Lozenge>
          </Tooltip>
        </AvatarItem>
        <Note>Consider using containers with bound widths for that:</Note>
        <div style={{ width: '400px' }}>
          <AvatarItem
            avatar={
              <Avatar name={irregularUser.name} src={irregularUser.avatarUrl} />
            }
            primaryText={irregularUser.name}
            secondaryText={irregularUser.email}
            childrenPlacement={this.state.placement}
          >
            <Lozenge>Teammate</Lozenge>
            <Tooltip
              tag="span"
              content="This user hasn't been active since <DATE>"
            >
              <Lozenge appearance="removed">On vacation?</Lozenge>
            </Tooltip>
          </AvatarItem>
        </div>
      </div>
    );
  }
}
