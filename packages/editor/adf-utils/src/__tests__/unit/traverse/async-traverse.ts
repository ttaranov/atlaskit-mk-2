import { asyncTraverse } from '../../../traverse/async-traverse';
import * as mentionsDoc from './__fixtures__/mentions.json';
import * as emojiDoc from './__fixtures__/emoji.json';

describe('Async Traverse', () => {
  it('should call a callback for all nodes of a given type', async () => {
    const visitor = jest.fn(() => Promise.resolve({}));
    await asyncTraverse(mentionsDoc, {
      mention: visitor,
    });

    expect(visitor).toHaveBeenCalledTimes(5);
    expect(visitor).toHaveBeenLastCalledWith(
      {
        type: 'mention',
        attrs: {
          id: 'all',
          text: '@all',
          accessLevel: 'CONTAINER',
        },
      },
      expect.objectContaining({}),
    );
  });

  it('should remove node when visitor returns false', async () => {
    expect(
      await asyncTraverse(emojiDoc, {
        emoji: async () => false,
      }),
    ).toMatchSnapshot();
  });

  it('should replace a node when visitor returns a new adf node', async () => {
    expect(
      await asyncTraverse(mentionsDoc, {
        mention: async node => ({
          ...node,
          attrs: { ...node.attrs, text: `${node.attrs!.text} – updated` },
        }),
      }),
    ).toMatchSnapshot();
  });

  it('should not process children nodes if parent node has been removed', async () => {
    const visitor = jest.fn(() => Promise.resolve({}));
    await asyncTraverse(emojiDoc, {
      paragraph: async () => false,
      emoji: visitor,
    });
    expect(visitor).not.toHaveBeenCalled();
  });

  it('should support "any" as a type', async () => {
    const visitor = jest.fn();
    await asyncTraverse(emojiDoc, {
      any: visitor,
    });
    expect(visitor).toHaveBeenCalledTimes(5);
  });
});
