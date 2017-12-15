/// <reference types="node" />
import * as schema from '@atlaskit/editor-common/json-schema/v1/full.json';
import { JSONSchema4 } from 'json-schema';
import * as RefParser from 'json-schema-ref-parser';
import createADFGenerator from './schema-generator';
import { transformSchema } from './utils';
import { SchemaNode } from './types';

const refParser = new RefParser();

export const getGeneratorFromJSONSchema = async (
  jsonSchema: JSONSchema4,
  options = {},
) => {
  const schema = await refParser.dereference(transformSchema(jsonSchema), {
    parse: { yaml: false, text: false, binary: false },
  });
  return createADFGenerator(schema as SchemaNode, options);
};

export default () => getGeneratorFromJSONSchema(schema);
