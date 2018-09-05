import { Emoji, EmojiDescription, toEmojiId } from '@atlaskit/emoji';
import * as React from 'react';
import { waitUntil } from '@atlaskit/util-common-test';
import { mount } from 'enzyme';
import Reaction, {
  ReactionOnClick,
  ReactionComponent,
} from '../../../internal/reaction';
import FlashAnimation from '../../../internal/flash-animation';
import { emoji, hasSelector } from '@atlaskit/util-data-test';
import { EmojiProvider } from '@atlaskit/emoji';
import ReactionTooltip from '../../../internal/reaction-tooltip';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { User, ReactionSummary } from '../../../reactions-resource/types';

const { getEmojiResourcePromise, newEmojiRepository } = emoji.testData;
const emojiRepository = newEmojiRepository();
const ari = 'ari:cloud:owner:demo-cloud-id:item/1';
const containerAri = 'ari:cloud:owner:demo-cloud-id:container/1';

const grinning: EmojiDescription = emojiRepository.findByShortName(
  ':grinning:',
) as EmojiDescription;

const buildReaction = (
  count: number,
  reacted: boolean,
  users?: User[],
): ReactionSummary => ({
  ari,
  containerAri,
  emojiId: toEmojiId(grinning).id!,
  count,
  reacted,
  users,
});

const renderReaction = (
  reacted: boolean,
  count: number,
  onClick: ReactionOnClick,
  flashOnMount: boolean = false,
) => (
  <Reaction
    reaction={buildReaction(count, reacted)}
    emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
    onClick={onClick}
    flashOnMount={flashOnMount}
  />
);

describe('@atlaskit/reactions/reaction', () => {
  it('should render emoji with resolved emoji data', () => {
    const reaction = mount(renderReaction(false, 1, () => {}));

    waitUntil(() => hasSelector(reaction, Emoji)).then(() => {
      const emoji = reaction.find(Emoji).first();
      expect(emoji.length).toEqual(1);
      const emojiDesc = emoji.prop('emoji');
      expect(emojiDesc.id).toEqual(grinning.id);
    });
  });

  it('should call onClick on click', () => {
    const onClickSpy = jest.fn();
    const reaction = mount(renderReaction(false, 1, onClickSpy));

    reaction
      .find('button')
      .first()
      .simulate('mouseup', { button: 0 });
    expect(onClickSpy).toHaveBeenCalled();
  });

  it('should delegate flash to Flash component', () => {
    const reaction = mount(renderReaction(true, 10, () => {}));

    const flash = reaction.find(FlashAnimation).instance() as FlashAnimation;

    const flashSpy = jest.spyOn(flash, 'flash');

    (reaction.find(ReactionComponent).instance() as ReactionComponent).flash();

    expect(flashSpy.mock.calls).toHaveLength(1);
  });

  it('should call flash when change to reacted', () => {
    const reaction = mount(renderReaction(false, 10, () => {}));

    const flash = reaction.find(FlashAnimation).instance() as FlashAnimation;
    const flashSpy = jest.spyOn(flash, 'flash');

    reaction.setProps({
      reaction: {
        ari,
        containerAri,
        emojiId: toEmojiId(grinning).id!,
        count: 11,
        reacted: true,
      },
    });

    expect(flashSpy.mock.calls).toHaveLength(1);
  });

  it('should call flash on mount', () => {
    const reaction = mount(renderReaction(true, 10, () => {}, true));

    const flash = reaction.find(FlashAnimation).instance() as FlashAnimation;
    const flashSpy = jest.spyOn(flash, 'flash');

    (reaction
      .find(ReactionComponent)
      .instance() as ReactionComponent).componentDidMount();

    expect(flashSpy.mock.calls).toHaveLength(1);
  });

  it('should render ReactionTooltip', () => {
    const reaction = mount(renderReaction(false, 1, () => {}));

    const tooltip = reaction.find(ReactionTooltip);
    expect(tooltip.prop('reaction')).toEqual(buildReaction(1, false));
  });

  describe('with analytics', () => {
    const onEvent = jest.fn();

    const ReactionWithAnalyticsListener = (props: {
      reacted: boolean;
      count: number;
      onClick: ReactionOnClick;
      users?: User[];
    }) => (
      <AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
        <Reaction
          reaction={buildReaction(props.count, props.reacted, props.users)}
          emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
          onClick={props.onClick}
        />
      </AnalyticsListener>
    );

    afterEach(() => {
      onEvent.mockClear();
    });

    it('should trigger clicked for Reaction', () => {
      const component = mount(
        <ReactionWithAnalyticsListener
          reacted={false}
          count={10}
          onClick={jest.fn()}
        />,
      );
      component
        .find('button')
        .first()
        .simulate('mouseup', { button: 0 });

      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            action: 'clicked',
            actionSubject: 'existingReaction',
            eventType: 'ui',
            attributes: {
              added: true,
              emojiId: toEmojiId(grinning).id!,
              containerAri,
              ari,
            },
          }),
        }),
        'fabric-elements',
      );
    });

    it('should trigger hovered for Reaction', () => {
      const component = mount(
        <ReactionWithAnalyticsListener
          reacted={false}
          count={10}
          onClick={jest.fn()}
        />,
      );
      component
        .find('button')
        .first()
        .simulate('mouseover');

      component.setProps({
        users: [
          {
            id: 'user-1',
            displayName: 'Luiz',
          },
        ],
      });

      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            action: 'hovered',
            actionSubject: 'existingReaction',
            eventType: 'ui',
            attributes: {
              duration: expect.any(Number),
              containerAri,
              ari,
            },
          }),
        }),
        'fabric-elements',
      );
    });
  });
});
