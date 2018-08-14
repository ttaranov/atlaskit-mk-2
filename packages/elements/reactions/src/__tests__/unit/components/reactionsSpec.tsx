import { EmojiProvider } from '@atlaskit/emoji';
import Tooltip from '@atlaskit/tooltip';
import { emoji } from '@atlaskit/util-data-test';
import { shallow } from 'enzyme';
import * as React from 'react';
import { reaction } from '../../../adapter/MockReactionsAdapter';
import { Reaction } from '../../../components/reaction';
import { ReactionPicker } from '../../../components/ReactionPicker';
import { Props, Reactions } from '../../../components/Reactions';
import { ReactionStatus } from '../../../types/ReactionStatus';

const { getEmojiResourcePromise } = emoji.testData;

describe('@atlaskit/reactions/reactions', () => {
  const renderReactions = (extraProps: Partial<Props> = {}) =>
    shallow(
      <Reactions
        emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
        reactions={[
          reaction(':fire:', 1, true),
          reaction(':thumbsup:', 9, false),
        ]}
        status={ReactionStatus.ready}
        onReactionClick={() => {}}
        onSelection={() => {}}
        loadReaction={() => {}}
        {...extraProps}
      />,
    );

  it('should trigger "onReactionClick" when Reaction is clicked', () => {
    const onReactionClick = jest.fn();
    const reactions = renderReactions({ onReactionClick });

    reactions
      .find(Reaction)
      .first()
      .simulate('click');
    expect(onReactionClick).toHaveBeenCalled();
  });

  it('should show loading tooltip and disable picker', () => {
    const reactions = renderReactions({ status: ReactionStatus.loading });
    expect(reactions.find(Tooltip).prop('content')).toEqual('Loading...');

    expect(reactions.find(ReactionPicker).prop('disabled')).toBeTruthy();
  });

  it('should show loading tooltip and disable picker when there is an error', () => {
    const reactions = renderReactions({
      status: ReactionStatus.error,
      errorMessage: 'Something is wrong',
    });

    expect(reactions.find(Tooltip).prop('content')).toEqual(
      'Something is wrong',
    );
    expect(reactions.find(ReactionPicker).prop('disabled')).toBeTruthy();
  });

  it('should render picker after reactions', () => {
    const reactions = renderReactions();
    const container = reactions
      .find('div')
      .first()
      .children();
    expect(container.last().find(ReactionPicker)).toHaveLength(1);
  });
});
