import { expect } from 'chai';
import emojiPlugin from '../../../../../src/editor/plugins/emoji';

describe('@atlaskit/editor-core/editor/plugins/emojiPlugin', () => {

  it('should have secondaryToolbarComponent defined', () => {
    expect(emojiPlugin.secondaryToolbarComponent).to.not.equal(undefined);
  });

  it('should have primaryToolbarComponent defined', () => {
    expect(emojiPlugin.primaryToolbarComponent).to.not.equal(undefined);
  });
});
