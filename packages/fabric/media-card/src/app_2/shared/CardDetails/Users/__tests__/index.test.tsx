import * as React from 'react';
import { shallow } from 'enzyme';
import { AvatarGroup } from '@atlaskit/avatar';
import Users from '..';

describe('Users', () => {
  it('should render zero users as null', () => {
    const element = shallow(<Users users={[]} />);
    expect(element.getNode()).toBeNull();
  });

  it('should render avatars', () => {
    const element = shallow(
      <Users
        users={[
          {
            icon: {
              url: 'https://www.example.com/',
              label: 'John Smith',
            },
          },
          {
            icon: {
              url: 'https://www.whisky.com/',
            },
          },
        ]}
      />,
    );
    expect(element.find(AvatarGroup).prop('data')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'John Smith',
          src: 'https://www.example.com/',
        }),
        expect.objectContaining({
          src: 'https://www.whisky.com/',
        }),
      ]),
    );
  });
});
