import { ReactWrapper, EnzymePropSelector } from 'enzyme';
import { EmojiPreview } from '@atlaskit/emoji';

export const findEmojiPreviewSection = component =>
  component.update() && component.find(EmojiPreview);

export const findCustomEmojiButton = component =>
  component.update() &&
  component.find(`Button[className="emoji-picker-add-emoji"]`);

export const customEmojiButtonVisible = (component): boolean =>
  findCustomEmojiButton(component).length > 0;

/**
 * Helper function for tests where explicit calls to update() are needed
 * for Enzyme 3 when React components' internal state has changed
 *
 * Only the root node can be updated but find() can be called on child nodes
 * If no child is passed in, find is called on the root node
 *
 * @param root ReactWrapper to update
 * @param prop Child component to find
 * @param child Optional child of root that find should be called on
 */
export function hasSelector(
  root: ReactWrapper<any, any>,
  prop: EnzymePropSelector,
  child?: ReactWrapper<any, any>,
): boolean {
  const component = child || root;
  root.update();
  return component.find(prop).length > 0;
}
