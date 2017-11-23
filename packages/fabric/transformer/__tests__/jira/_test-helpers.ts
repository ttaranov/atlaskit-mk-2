import { Node, Schema } from 'prosemirror-model';

import {
  default as JIRATransformer,
  JIRACustomEncoders,
  MediaContextInfo,
} from '../../src/jira';

export function parseWithSchema(html: string, schema: Schema) {
  const transformer = new JIRATransformer(schema);
  return transformer.parse(html);
}

export function encode(
  node: Node,
  schema: Schema,
  customEncoders: JIRACustomEncoders = {},
  mediaContextInfo?: MediaContextInfo,
) {
  const transformer = new JIRATransformer(
    schema,
    customEncoders,
    mediaContextInfo,
  );
  return transformer.encode(node);
}

export function checkParse(
  description: string,
  schema: Schema,
  htmls: string[],
  node: Node,
) {
  it(`parses HTML: ${description}`, () => {
    for (const html of htmls) {
      const actual = parseWithSchema(html, schema);
      expect(actual).toEqualDocument(node);
    }
  });
}

export function checkEncode(
  description: string,
  schema: Schema,
  node: Node,
  html: string,
  customEncoders: JIRACustomEncoders = {},
  mediaContextInfo?: MediaContextInfo,
) {
  it(`encodes HTML: ${description}`, () => {
    const encoded = encode(node, schema, customEncoders, mediaContextInfo);
    expect(encoded).toEqual(html);
  });
}

export function checkParseEncodeRoundTrips(
  description: string,
  schema: Schema,
  html: string,
  node: Node,
  customEncoders: JIRACustomEncoders = {},
  mediaContextInfo?: MediaContextInfo,
) {
  it(`parses HTML: ${description}`, () => {
    const actual = parseWithSchema(html, schema);
    expect(actual).toEqualDocument(node);
  });

  it(`encodes HTML: ${description}`, () => {
    const encoded = encode(node, schema, customEncoders, mediaContextInfo);
    expect(html).toEqual(encoded);
  });

  it(`round-trips HTML: ${description}`, () => {
    const roundTripped = parseWithSchema(
      encode(node, schema, customEncoders, mediaContextInfo),
      schema,
    );
    expect(roundTripped).toEqualDocument(node);
  });
}
