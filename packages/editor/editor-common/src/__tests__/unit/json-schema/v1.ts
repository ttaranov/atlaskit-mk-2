import { name } from '../../../../package.json';
import * as Ajv from 'ajv';
import { readFilesSync } from '../../../../test-helpers';

import * as v1schemaFull from '../../../../json-schema/v1/full.json';
import * as v1schemaStage0 from '../../../../json-schema/v1/stage-0.json';

const ajv = new Ajv();

const schemas = {
  full: v1schemaFull,
  'stage-0': v1schemaStage0,
};

describe(`${name} json-schema v1`, () => {
  Object.keys(schemas).forEach(schemaName => {
    describe(schemaName, async () => {
      const schema = schemas[schemaName];
      const validate = ajv.compile(schema);

      const valid = readFilesSync(
        `${__dirname}/v1-reference/${schemaName}/valid`,
      );
      valid.forEach(file => {
        it(`validates '${file.name}`, () => {
          validate(file.data);
          expect(validate.errors).toEqual(null);
        });
      });

      const invalid = readFilesSync(
        `${__dirname}/v1-reference/${schemaName}/invalid`,
      );
      invalid.forEach(file => {
        it(`does not validate '${file.name}`, () => {
          expect(validate(file.data)).toEqual(false);
        });
      });
    });
  });
});
