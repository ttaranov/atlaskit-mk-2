import { expect } from 'chai';

import { editorShowLoading } from '../../editorShowLoading';

describe('editorShowLoading action creator', () => {
  const originalFile = {
    id: 'some-id',
    name: 'some-name',
  };

  it('should create action with type and file', () => {
    const action = editorShowLoading(originalFile);
    expect(action).to.deep.equal({
      type: 'EDITOR_SHOW_LOADING',
      originalFile,
    });
  });
});
