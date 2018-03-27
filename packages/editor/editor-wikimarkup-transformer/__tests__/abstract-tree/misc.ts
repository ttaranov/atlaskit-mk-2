import WikiMarkupTransformer from '../../src';

describe('JIRA wiki markup - Misc', () => {
  it('should find emojis in text', () => {
    const markup = 'this is a string with :) emojis in it (*) tada';
    const transformer = new WikiMarkupTransformer();

    expect(transformer.parse(markup)).toMatchSnapshot();
  });

  it('should find emojis in text with marks', () => {
    const markup = 'this is a string ~with :) emojis~ in it (*) tada';
    const transformer = new WikiMarkupTransformer();

    expect(transformer.parse(markup)).toMatchSnapshot();
  });
});
