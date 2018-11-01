import WikiMarkupTransformer from '../../..';

describe('WikiMarkup => ADF Formatters - citation', () => {
  test('[CS-491] should detect mention in the following pattern', () => {
    const wiki =
      'Hi [~qm:78032763-2feb-4f5b-88c0-99b50613d53a:5bce2c0c5b397117c112bc02],';

    const transformer = new WikiMarkupTransformer();
    expect(transformer.parse(wiki)).toMatchSnapshot();
  });
});
