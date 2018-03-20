import { convert } from '../src/convert';

describe('convert()', () => {
  it('should return a href when json.url does exist', () => {
    const data = {
      url: 'https://www.trello.com/',
    };
    expect(convert(data)).toHaveProperty('href', 'https://www.trello.com/');
  });

  it('should not return a href when json.url does not exist', () => {
    const data = {};
    expect(convert(data)).not.toHaveProperty('href');
  });

  it('should return a context.text when json.context[x].name does exist', () => {
    const data = {
      context: [
        {
          name: 'foobar',
        },
      ],
    };
    expect(convert(data)).toHaveProperty('context.text', 'foobar');
  });

  it('should return an empty context.text when json.context[x].name does not exist', () => {
    const data = {};
    expect(convert(data)).toHaveProperty('context.text', '');
  });

  it('should return a title.text when json.name does exist', () => {
    const data = {
      name: 'foobar',
    };
    expect(convert(data)).toHaveProperty('title.text', 'foobar');
  });

  it('should return an empty title.text when json.name does not exist', () => {
    const data = {};
    expect(convert(data)).toHaveProperty('title.text', '');
  });

  it('should return a description.text when json.summary does exist', () => {
    const data = {
      summary: 'foobar',
    };
    expect(convert(data)).toHaveProperty('description.text', 'foobar');
  });

  it('should return an empty description.text when json.summary does not exist', () => {
    const data = {};
    expect(convert(data)).toHaveProperty('description.text', '');
  });

  it('should return a details when json.atl:lastActivity does exist', () => {
    const data = {
      'atl:lastActivity': '2016-07-28T19:02:13.787Z',
    };
    expect(convert(data).details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          text: 'Jul 29, 2016',
        }),
      ]),
    );
  });

  it('should return an empty details when json.atl:lastActivity does not exist', () => {
    const data = {};
    expect(convert(data).details).toHaveLength(0);
  });

  it('should return a details when a tag does exist', () => {
    const data = {
      tag: [
        {
          name: 'Engineering',
        },
      ],
    };
    expect(convert(data).details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          lozenge: {
            text: 'Engineering',
          },
        }),
      ]),
    );
  });

  it('should return an empty details when a tag does not exist', () => {
    const data = {};
    expect(convert(data).details).toHaveLength(0);
  });
});
