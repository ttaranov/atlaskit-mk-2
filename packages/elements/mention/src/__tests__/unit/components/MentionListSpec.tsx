import { waitUntil } from '@atlaskit/util-common-test';
import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';

import { mention } from '@atlaskit/util-data-test';
import MentionList, { Props, State } from '../../../components/MentionList';
import MentionItem from '../../../components/MentionItem';
import { isMentionItemSelected } from '../_test-helpers';

const { mentionDataSize } = mention.mentionData;
const mentions = mention.mentionData.mentionResult;

describe('MentionList', () => {
  let component;
  let defaultMentionItemsShow;
  const setupList = (props?: Props) =>
    mount(<MentionList mentions={mentions} {...props} />) as ReactWrapper<
      Props,
      State
    >;

  beforeEach(() => {
    component = setupList();
    defaultMentionItemsShow = () =>
      component.find(MentionItem).length === mentionDataSize;
  });

  afterEach(() => {
    component.unmount();
  });

  it('should have first item selected by default', () => {
    const firstItemSelected = () =>
      isMentionItemSelected(component, mentions[0].id);

    return waitUntil(defaultMentionItemsShow).then(() =>
      waitUntil(firstItemSelected),
    );
  });

  it('selectIndex selects correct item', () => {
    const thirdItemSelected = () => {
      return isMentionItemSelected(component, mentions[2].id);
    };

    return waitUntil(defaultMentionItemsShow).then(() => {
      const mentionList = component.instance() as MentionList;
      mentionList.selectIndex(2);
      component.update();
      return waitUntil(thirdItemSelected);
    });
  });

  it('selectId selects correct item', () => {
    const thirdItemSelected = () =>
      isMentionItemSelected(component, mentions[2].id);

    return waitUntil(defaultMentionItemsShow).then(() => {
      const mentionList = component.instance() as MentionList;
      mentionList.selectId(mentions[2].id);
      component.update();
      return waitUntil(thirdItemSelected);
    });
  });

  it('mentionsCount returns the number of mentions in the list', () => {
    return waitUntil(defaultMentionItemsShow).then(() => {
      const mentionList = component.instance() as MentionList;
      expect(mentionList.mentionsCount()).toEqual(mentionDataSize);
    });
  });

  it('should retain a deliberate selection across changing list of mentions', () => {
    return waitUntil(defaultMentionItemsShow).then(() => {
      const mentionList = component.instance() as MentionList;

      // select item 3 in the mention list
      mentionList.selectIndex(2);
      component.update();
      const thirdItemSelected = () =>
        isMentionItemSelected(component, mentions[2].id);

      return waitUntil(thirdItemSelected).then(() => {
        // remove the first item from the mentions array and set the new mentions
        const reducedMentionsList = mentions.slice(1);
        component.setProps({
          mentions: reducedMentionsList,
        });

        const reducedListOfItemsShow = () => {
          return (
            component.find(MentionItem).length === reducedMentionsList.length
          );
        };

        return waitUntil(reducedListOfItemsShow).then(() => {
          // ensure item 2 is now selected
          const secondItemSelected = () =>
            isMentionItemSelected(component, reducedMentionsList[1].id);
          component.update();
          return waitUntil(secondItemSelected);
        });
      });
    });
  });

  it('should select first item for each changing set of mentions if no deliberate selection is made', () => {
    return waitUntil(defaultMentionItemsShow).then(() => {
      const firstItemSelected = () =>
        isMentionItemSelected(component, mentions[0].id);
      return waitUntil(firstItemSelected).then(() => {
        // move the first item to the third position in a new list.
        // Note that I've also removed a single item from the list so I can differentiate when the new mentions are shown using length
        const reducedMentionsList = [
          ...mentions.slice(1, 3),
          mentions[0],
          ...mentions.slice(4),
        ];

        component.setProps({
          mentions: reducedMentionsList,
        });

        const reducedListOfItemsShow = () => {
          return (
            component.find(MentionItem).length === reducedMentionsList.length
          );
        };

        return waitUntil(reducedListOfItemsShow).then(() => {
          // ensure item 0 is still selected
          const newfirstItemSelected = () =>
            isMentionItemSelected(component, reducedMentionsList[0].id);
          return waitUntil(newfirstItemSelected);
        });
      });
    });
  });
});
