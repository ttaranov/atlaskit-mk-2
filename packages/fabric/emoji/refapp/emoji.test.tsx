import * as React from 'react';
import * as render from 'react-test-renderer';
import CoreEditor from './MessageEditor';
import { mount, shallow } from 'enzyme';
import { waitUntil } from '@atlaskit/util-common-test';
import EmojiTypeahead from '../src/components/typeahead/EmojiTypeAhead';

describe('emojis:', function() {
  const escape = 'Escape';
  const enter = 'Enter';
  let space = 'Space';

  before(() => {
    // hack to get around jsdom selection limitation
    const selectionFixture = {
      removeAllRanges: () => {},
      addRange: () => {},
    };
    // Do nothing when attempting to retrieve selection
    window.getSelection = () => {
      return selectionFixture as any;
    };

    document.getSelection = () => {
      return selectionFixture as any;
    };
  });

  it('show emojis popup', async () => {
    const wrapper = mount(<CoreEditor />);
    expect(wrapper.find('[contenteditable="true"]').exists()).toBeTruthy;

    //expect(wrapper.find('[aria-label="Insert emoji (:)"]').simulate('click')).
    //toContain('FREQUENT');

    // await editor.simulate('change', { target: { value: ':' } });
    // await waitUntil(() => wrapper.find(EmojiTypeahead).length > 0);
    // expect(wrapper.find(EmojiTypeahead)).toHaveLength(1);
  });

  // it('should not show emoji picker when text: ',function(){
  //   const usecase2 = 'this:';
  //   EditorPage.editable.setValue([' ']);
  //   EditorPage.editable.addValue(usecase2);
  //   browser.waitForExist(EditorPage.emojiPicker,3000,true);
  //   expect(EditorPage.contains(EditorPage.emojiPicker).should.be.equal(false));
  // });

  // it('should replace emojis', function () {
  //   const usecase1 = ':grin:';
  //   const usecase2 = ':waiting';
  //   const usecase3 = ':a';
  //   const emojigrin = '[data-emoji-short-name=\':grin:\']';
  //   const emojiwait = '[data-emoji-id=\'atlassian-waiting\']';
  //   const smile = '[data-emoji-short-name=\':slight_smile:\']';
  //   const a = '[data-emoji-short-name=\':a:\']';

  //   EditorPage.editable.setValue([' ']);
  //   EditorPage.editable.addValue(usecase1);
  //   EditorPage.editable.addValue(enter);
  //   EditorPage.waitForElement(emojigrin);
  //   expect(EditorPage.contains(emojigrin).should.be.equal(true));

  //   EditorPage.editable.addValue(usecase2);
  //   browser.waitForExist(EditorPage.emojiPicker,3000);
  //   EditorPage.editable.addValue([' ',' there']);
  //   EditorPage.editable.addValue(enter);
  //   EditorPage.waitForElement(emojiwait);
  //   expect(EditorPage.contains(emojiwait).should.be.equal(true));

  //   EditorPage.editable.addValue(usecase3);
  //   browser.waitForExist(EditorPage.emojiPicker,3000);
  //   EditorPage.editable.addValue(enter);
  //   EditorPage.waitForElement(a);
  //   expect(EditorPage.contains(a).should.be.equal(true));

  //   EditorPage.editable.setValue(':');
  //   EditorPage.editable.addValue(')');
  //   EditorPage.editable.addValue(enter);
  //   EditorPage.waitForElement(smile);
  //   expect(EditorPage.contains(smile).should.be.equal(true));

  // });

  // it('should not show emojis picker on esc', function () {
  //   const usecase1 = ':smile';
  //   EditorPage.editable.setValue([' ']);
  //   EditorPage.editable.addValue([' ']);
  //   EditorPage.addText(usecase1);
  //   EditorPage.waitForElement(EditorPage.emojiPicker);
  //   EditorPage.editable.addValue(escape);
  //   EditorPage.waitForElement(EditorPage.paragraphText(usecase1));
  //   expect(EditorPage.contains(EditorPage.emojiPicker).should.be.equal(false));
  // });

  // it('should not show emoji picker on space and remove on escape',function(){
  //   EditorPage.editable.setValue([' ']);
  //   EditorPage.editable.addValue([' ']);
  //   EditorPage.addText(':smil ');
  //   EditorPage.waitForElement(EditorPage.emojiPicker);
  //   EditorPage.waitForElement(EditorPage.paragraphText(':smil'));
  //   EditorPage.editable.addValue(escape);
  //   expect(EditorPage.contains(EditorPage.emojiPicker).should.be.equal(false));
  // });

  // it('should be able to pick from emojis picker', function () {
  //   const usecase1 = ':all';
  //   const emojiList = '.ak-emoji-typeahead-item';
  //   const pickEmoji = '[data-emoji-id=\':catchemall:\']';
  //   const pickedEmoji = '[data-emoji-short-name=\':catchemall:\']';

  //   EditorPage.editable.setValue([' ']);
  //   EditorPage.editable.addValue(['catching ',usecase1]);
  //   EditorPage.waitForElement(emojiList);
  //   EditorPage.click(pickEmoji);
  //   EditorPage.waitForElement(pickedEmoji);
  //   EditorPage.contains(pickedEmoji).should.be.equal(true);
  // });

  // it('should be able to add emojis with bold and italics', function () {
  //   const usecase1 = ':grin:';
  //   const emojigrin = '[data-emoji-short-name=\':grin:\']';
  //   const bold = '__bold__ ';
  //   EditorPage.editable.setValue([bold,' ']);
  //   EditorPage.waitForElement('strong');
  //   EditorPage.addText(usecase1);
  //   EditorPage.waitForElement(emojigrin);
  //   expect(EditorPage.contains(emojigrin).should.be.equal(true));

  // });

  // it('should not show emojis picker when text:', function () {
  //   const usecase1 = 'test:';
  //   EditorPage.editable.setValue(usecase1);
  //   expect(EditorPage.contains(EditorPage.emojiPicker).should.be.equal(false));
  // });
});
