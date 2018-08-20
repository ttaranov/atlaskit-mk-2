import { expect } from 'chai';

import { editorClose, EDITOR_CLOSE } from '../../editorClose';

describe('editorClose action creator', () => {
  it('should return only action type', () => {
    const action = editorClose();
    expect(action).to.deep.equal({
      type: EDITOR_CLOSE,
    });
  });
});
