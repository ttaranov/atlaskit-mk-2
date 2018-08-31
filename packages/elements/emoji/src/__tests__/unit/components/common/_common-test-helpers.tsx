import * as commonStyles from '../../../../components/common/styles';

export const findEmojiPreviewSection = component =>
  component.update() && component.find(`.${commonStyles.emojiPreviewSection}`);

export const findCustomEmojiButton = component =>
  component.update() &&
  component.find(`Button[className="emoji-picker-add-emoji"]`);

export const customEmojiButtonVisible = (component): boolean =>
  findCustomEmojiButton(component).length > 0;
