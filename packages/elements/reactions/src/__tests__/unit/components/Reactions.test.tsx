import { AnalyticsListener } from '@atlaskit/analytics-next';
import { EmojiProvider } from '@atlaskit/emoji';
import Tooltip from '@atlaskit/tooltip';
import { emoji } from '@atlaskit/util-data-test';
import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { reaction } from '../../../client/MockReactionsClient';
import { Reaction } from '../../../components/Reaction';
import { ReactionPicker } from '../../../components/ReactionPicker';
import { Props, Reactions } from '../../../components/Reactions';
import { Trigger } from '../../../components/Trigger';
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
    )
      .dive()
      .dive();

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

  describe('with analytics', () => {
    const onEvent = jest.fn();
    let component;

    const TestComponent = (props: Partial<Props>) => (
      <AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
        <Reactions
          emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
          reactions={[
            reaction(':fire:', 1, true),
            reaction(':thumbsup:', 9, false),
          ]}
          status={ReactionStatus.loading}
          onReactionClick={() => {}}
          onSelection={() => {}}
          loadReaction={() => {}}
          {...props}
        />
      </AnalyticsListener>
    );

    beforeEach(() => {
      component = mount(<TestComponent />);
      component.setProps({ status: ReactionStatus.ready });
    });

    afterEach(() => {
      onEvent.mockClear();
    });

    it('should trigger render', () => {
      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            action: 'rendered',
            actionSubject: 'reactionView',
            eventType: 'operational',
            attributes: {
              duration: expect.any(Number),
              packageName: '@atlaskit/reactions',
              packageVersion: expect.any(String),
            },
          }),
        }),
        'fabric-elements',
      );
    });

    describe('with ReactionPicker open', () => {
      beforeEach(() => {
        component.find(Trigger).simulate('click');
      });

      it('should trigger clicked for Reaction Picker Button', () => {
        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'clicked',
              actionSubject: 'reactionPickerButton',
              eventType: 'ui',
              attributes: {
                reactionEmojiCount: 2,
                packageName: '@atlaskit/reactions',
                packageVersion: expect.any(String),
              },
            }),
          }),
          'fabric-elements',
        );
      });

      it('should trigger cancelled for ReactionPicker', () => {
        component.find(ReactionPicker).prop('onCancel')();

        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'cancelled',
              actionSubject: 'reactionPicker',
              eventType: 'ui',
              attributes: {
                duration: expect.any(Number),
                packageName: '@atlaskit/reactions',
                packageVersion: expect.any(String),
              },
            }),
          }),
          'fabric-elements',
        );
      });

      it('should trigger clicked for new emoji', () => {
        component.find(ReactionPicker).prop('onSelection')(
          'emoji-1',
          'quickSelector',
        );

        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'clicked',
              actionSubject: 'reactionPicker',
              actionSubjectId: 'emoji',
              eventType: 'ui',
              attributes: {
                duration: expect.any(Number),
                emojiId: 'emoji-1',
                previousState: 'new',
                source: 'quickSelector',
                packageName: '@atlaskit/reactions',
                packageVersion: expect.any(String),
              },
            }),
          }),
          'fabric-elements',
        );
      });

      it('should trigger clicked for existing emoji', () => {
        component.find(ReactionPicker).prop('onSelection')(
          '1f44d',
          'quickSelector',
        );

        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'clicked',
              actionSubject: 'reactionPicker',
              actionSubjectId: 'emoji',
              eventType: 'ui',
              attributes: {
                duration: expect.any(Number),
                emojiId: '1f44d',
                previousState: 'existingNotReacted',
                source: 'quickSelector',
                packageName: '@atlaskit/reactions',
                packageVersion: expect.any(String),
              },
            }),
          }),
          'fabric-elements',
        );
      });

      it('should trigger clicked for existing reacted emoji', () => {
        component.find(ReactionPicker).prop('onSelection')(
          '1f525',
          'quickSelector',
        );

        return Promise.resolve().then(() => {
          expect(onEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              payload: expect.objectContaining({
                action: 'clicked',
                actionSubject: 'reactionPicker',
                actionSubjectId: 'emoji',
                eventType: 'ui',
                attributes: {
                  duration: expect.any(Number),
                  emojiId: '1f525',
                  previousState: 'existingReacted',
                  source: 'quickSelector',
                  packageName: '@atlaskit/reactions',
                  packageVersion: expect.any(String),
                },
              }),
            }),
            'fabric-elements',
          );
        });
      });

      it('should trigger clicked from emojiPicker', () => {
        component.find(ReactionPicker).prop('onMore')();

        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'clicked',
              actionSubject: 'reactionPicker',
              actionSubjectId: 'more',
              eventType: 'ui',
              attributes: {
                duration: expect.any(Number),
                packageName: '@atlaskit/reactions',
                packageVersion: expect.any(String),
              },
            }),
          }),
          'fabric-elements',
        );

        component.find(ReactionPicker).prop('onSelection')(
          '1f525',
          'emojiPicker',
        );

        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'clicked',
              actionSubject: 'reactionPicker',
              actionSubjectId: 'emoji',
              eventType: 'ui',
              attributes: {
                duration: expect.any(Number),
                emojiId: '1f525',
                previousState: 'existingReacted',
                source: 'emojiPicker',
                packageName: '@atlaskit/reactions',
                packageVersion: expect.any(String),
              },
            }),
          }),
          'fabric-elements',
        );
      });
    });
  });
});
