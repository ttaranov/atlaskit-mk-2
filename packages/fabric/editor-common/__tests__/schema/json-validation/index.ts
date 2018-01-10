import { name } from '../../../package.json';
import * as v1schema from '../../../json-schema/v1/full.json';
import * as Ajv from 'ajv';
import {
  doc,
  p,
  h1,
  strong,
  blockquote,
  panel,
  ol,
  li,
} from '../../../test-helpers';

const ajv = new Ajv();
const validate = ajv.compile(v1schema);

const addVersion = json => {
  json.version = 1;
  return json;
};

describe(`${name} schema json`, () => {
  it('valid nodes', () => {
    validate(addVersion(doc(blockquote(p('text'))).toJSON()));
    validate(addVersion(doc(h1(strong('hello'))).toJSON()));
    validate(addVersion(doc(panel(p('text'))).toJSON()));
    validate(
      addVersion(
        doc(ol(li(p('text')), li(p('te{<>}xt')), li(p('text')))).toJSON(),
      ),
    );
    expect(validate.errors).toEqual(null);
  });
});
