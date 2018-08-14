import { validate } from '../../src/validator';

describe('validate', () => {
  it('should throw when required attrs are missing', () => {
    const run = () => {
      validate({
        type: 'doc',
        version: 1,
      });
    };
    expect(run).toThrowError('doc: required prop missing.');
  });

  it('should throw when content does not meet requirement', () => {
    const run = () => {
      validate({
        type: 'doc',
        version: 1,
        content: [],
      });
    };
    expect(run).toThrowError(`doc: 'content' should have more than 1 child.`);
  });

  it('should throw for invalid content', () => {
    const run = () => {
      validate({
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'hello' }],
              },
            ],
          },
        ],
      });
    };
    expect(run).toThrowError('doc: invalid content.');
  });

  it('should throw when required attrs are missing inside children', () => {
    const run = () => {
      validate({
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
          },
        ],
      });
    };
    expect(run).toThrowError('paragraph: required prop missing.');
  });

  it('should not throw when required attrs are available', () => {
    const run = () => {
      validate({
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [],
          },
        ],
      });
    };
    expect(run).not.toThrowError();
  });

  it('should not throw for valid document', () => {
    const run = () => {
      validate({
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Hello',
                marks: [
                  {
                    type: 'strong',
                  },
                ],
              },
              {
                type: 'text',
                text: ' world!',
              },
            ],
          },
        ],
      });
    };
    expect(run).not.toThrowError();
  });

  it('should be able to wrap invalid nodes', () => {
    const invalidNode = {
      type: 'tet',
      text: ' world!',
    };
    const invalidDoc = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello',
              marks: [
                {
                  type: 'strong',
                },
              ],
            },
            invalidNode,
            {
              type: 'text',
              text: 'World!',
              marks: [
                {
                  type: 'strong',
                },
              ],
            },
          ],
        },
      ],
    };

    const run = () => {
      const result = validate(invalidDoc, x => {
        expect(x).not.toBe(invalidNode);
        expect(x).toEqual(invalidNode);
        return {
          type: 'unknown',
          attrs: {
            originalNode: x,
          },
        };
      });
      expect(result.entity).toMatchSnapshot();
    };

    expect(run).not.toThrowError();
    expect(invalidDoc).toMatchSnapshot();
  });

  it('should be able to wrap invalid nodes - 2', () => {
    const invalidDoc = {
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Foo',
              marks: [
                {
                  type: 'code',
                },
                {
                  type: 'underline',
                },
              ],
            },
          ],
        },
      ],
    };

    const run = () => {
      const result = validate(invalidDoc, x => {
        return {
          type: 'unknown',
          attrs: {
            originalNode: x,
          },
        };
      });
      expect(result.entity).toMatchSnapshot();
    };

    expect(run).not.toThrowError();
    expect(invalidDoc).toMatchSnapshot();
  });
});
