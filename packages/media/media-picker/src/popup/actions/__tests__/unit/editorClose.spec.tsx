import { expect } from 'chai';

import { editorClose, EDITOR_CLOSE } from '../../editorClose';

describe('editorClose action creator', () => {
  it('should return action type and selection Save', () => {
    expect(editorClose('Save')).to.deep.equal({
      type: EDITOR_CLOSE,
      selection: 'Save',
    });
  });

  it('should return action type and selection Close', () => {
    expect(editorClose('Close')).to.deep.equal({
      type: EDITOR_CLOSE,
      selection: 'Close',
    });
  });
});
