import { expect } from 'chai';

import { editRemoteImage, EDIT_REMOTE_IMAGE } from '../../editRemoteImage';

describe('editRemoteImage action creator', () => {
  const mediaItem: any = {
    type: 'file',
    details: {
      id: 'some-id',
      name: 'some-name',
    },
  };
  const collectionName = 'some-collection-name';

  it('should create action with item and collection name', () => {
    const action = editRemoteImage(mediaItem, collectionName);
    expect(action).to.deep.equal({
      type: EDIT_REMOTE_IMAGE,
      item: mediaItem,
      collectionName,
    });
  });
});
