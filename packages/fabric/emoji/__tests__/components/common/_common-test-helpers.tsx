export const findEmojiPreviewSection = component =>
  component.update() && component.find('.emojiPreviewSection');

export const findStartEmojiUpload = component =>
  component.update() &&
  component.find(`Button[className="emoji-picker-add-emoji"]`);

export const startEmojiUploadVisible = (component): boolean =>
  findStartEmojiUpload(component).length > 0;
