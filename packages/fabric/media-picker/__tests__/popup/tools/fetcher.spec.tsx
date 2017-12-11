import { Service } from '../../../src/popup/domain';
import { flattenAccounts } from '../../../src/popup/tools/fetcher/fetcher';

describe('flattenAccounts()', () => {
  const services: Service[] = [
    {
      type: 'dropbox',
      status: 'available',
      accounts: [
        {
          id: 'dropbox|111111111',
          name: 'User',
          picture: 'https://s.gravatar.com/avatar/somehash.png',
          status: 'available',
          nickname: 'user',
          email: 'user@atlassian.com',
        },
      ],
    },
    {
      type: 'google',
      status: 'available',
      accounts: [],
    },
  ];

  it('flattens the response data into a list of accounts', () => {
    const flattened = flattenAccounts(services);
    expect(flattened).toEqual([
      {
        id: 'dropbox|111111111',
        name: 'User',
        picture: 'https://s.gravatar.com/avatar/somehash.png',
        status: 'available',
        nickname: 'user',
        email: 'user@atlassian.com',
        type: 'dropbox',
      },
    ]);
  });
});
