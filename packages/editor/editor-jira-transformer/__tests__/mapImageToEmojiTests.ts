import { mapImageToEmoji } from '../src/emojiHelper';

describe('emojiHelper', () => {
  it(`maps correctly formed image tags`, () => {
    let imageElement = new Image();
    imageElement.src = '/images/icons/emoticons/smile.png';
    let result = mapImageToEmoji(imageElement);
    expect(result).toEqual('🙂');
  });

  it(`maps image tags with unqualified image url`, () => {
    let imageElement = new Image();
    imageElement.src = 'smile.png';
    let result = mapImageToEmoji(imageElement);
    expect(result).toEqual('🙂');
  });

  it(`maps image tags with preceding slash`, () => {
    let imageElement = new Image();
    imageElement.src = '/smile.png';
    let result = mapImageToEmoji(imageElement);
    expect(result).toEqual('🙂');
  });

  it(`does not map image tags without src`, () => {
    let imageElement = new Image();
    let result = mapImageToEmoji(imageElement);
    expect(result).toBeNull();
  });

  it(`does not map image tags with no filename`, () => {
    let imageElement = new Image();
    imageElement.src = '/images/icons/emoticons/';
    let result = mapImageToEmoji(imageElement);
    expect(result).toBeNull();
  });

  it(`does not map image tags with file name that does not correspond to an emoji`, () => {
    let imageElement = new Image();
    imageElement.src = '/images/icons/emoticons/invalidemoji.png';
    let result = mapImageToEmoji(imageElement);
    expect(result).toBeNull();
  });
});
