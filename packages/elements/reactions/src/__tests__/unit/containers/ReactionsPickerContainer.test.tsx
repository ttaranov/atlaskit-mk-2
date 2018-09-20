import { EmojiProvider } from '@atlaskit/emoji';
import * as React from 'react';
import ReactionPickerContainer from '../../../containers/ReactionsPickerContainer';
import { ReactionConsumer } from '../../../reaction-store/ReactionConsumer';
import { shallow } from 'enzyme';

import { emoji } from '@atlaskit/util-data-test';

const { getEmojiResourcePromise } = emoji.testData;

describe('ReactionPickerContainer', () => {
  const containerAri = 'container-ari';
  const ari = 'ari';

  const actions = {
    getReactions: jest.fn(),
    toggleReaction: jest.fn(),
    addReaction: jest.fn(),
    getDetailedReaction: jest.fn(),
  };

  let container;
  let actionsMapper;

  beforeAll(() => {
    container = shallow(
      <ReactionPickerContainer
        containerAri={containerAri}
        ari={ari}
        emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
      />,
    );

    const props = container.find(ReactionConsumer).props();
    actionsMapper = props.actionsMapper;
  });

  describe('actions', () => {
    let mappedActions;
    beforeAll(() => {
      mappedActions = actionsMapper(actions);
    });

    it('should call addReaction onSelection', () => {
      mappedActions.onSelection('emojiA');

      expect(actions.addReaction).toHaveBeenCalledTimes(1);
      expect(actions.addReaction).toHaveBeenCalledWith(
        containerAri,
        ari,
        'emojiA',
      );
    });
  });
});
