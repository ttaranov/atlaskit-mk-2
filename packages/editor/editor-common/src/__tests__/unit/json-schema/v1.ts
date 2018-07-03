import { name } from '../../../../package.json';
import * as v1schema from '../../../../json-schema/v1/full.json';
import * as Ajv from 'ajv';
import { readFilesSync } from '../../../../test-helpers';

const ajv = new Ajv();
const validate = ajv.compile(v1schema);

describe(`${name} json-schema v1`, () => {
  const valid = readFilesSync(`${__dirname}/v1-reference/valid`);
  valid.forEach(file => {
    it(`validates '${file.name}`, () => {
      validate(file.data);
      expect(validate.errors).toEqual(null);
    });
  });

  const invalid = readFilesSync(`${__dirname}/v1-reference/invalid`);
  invalid.forEach(file => {
    it(`does not validate '${file.name}`, () => {
      expect(validate(file.data)).toEqual(false);
    });
  });
});
