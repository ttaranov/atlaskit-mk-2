import * as React from 'react';
import { shallow } from 'enzyme';
import { AvatarGroup } from '@atlaskit/avatar';
import Users from '../../../../src/block/DetailView/Users';

describe('Users', () => {
  it('should render zero users as null', () => {
    const element = shallow(<Users users={[]} />);
    expect(element.getElement()).toBeNull();
  });

  it('should render avatars', () => {
    const element = shallow(
      <Users
        users={[
          {
            icon: 'https://www.example.com/',
            name: 'John Smith',
          },
          {
            icon: 'https://www.whisky.com/',
          },
        ]}
      />,
    );
    expect(element.find(AvatarGroup).prop('props')).toEqual(
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
