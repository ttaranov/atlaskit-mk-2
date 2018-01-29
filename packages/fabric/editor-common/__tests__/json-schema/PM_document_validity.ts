import * as schema from '../../json-schema/v1/full.json';
import { Node } from 'prosemirror-model';
import { defaultSchema } from '@atlaskit/editor-test-helpers';
// tslint:disable-next-line:no-var-requires
const jsf = require('json-schema-faker');

/**
 *
 * @param json The function cleans up schema for use by json-schema-faker.
 */
const cleanUpSchema = json => {
  // Following 2 lines remove cyclic references in the schema.
  json.definitions.extension_content.items.anyOf = json.definitions.extension_content.items.anyOf.filter(
    obj => obj.$ref.indexOf('table_node') < 0,
  );
  json.definitions.listItem_node.properties.content.items.anyOf = json.definitions.listItem_node.properties.content.items.anyOf.filter(
    obj => obj.$ref.indexOf('List') < 0,
  );
  // This remove mark property from codeBlock_node, property is array type of maxLength 0 which is creating trouble.
  const index = json.definitions.codeBlock_node.properties.content.items.allOf.findIndex(
    item => item.properties && item.properties.marks,
  );
  delete json.definitions.codeBlock_node.properties.content.items.allOf[index];
  return json;
};

/**
 * Function to check if JSON is a valid PM document.
 */
const isJSONValid = (json, nodeRef) => {
  let valid = true;
  try {
    Node.fromJSON(defaultSchema, json).check();
  } catch (exp) {
    valid = false;
    // tslint:disable-next-line:no-console
    console.warn('PM validation failed for node', nodeRef);
    // tslint:disable-next-line:no-console
    console.warn('JSON = ', JSON.stringify(json, undefined, 2));
  }
  return valid;
};

describe('JSON schema', () => {
  let filteredSchema = cleanUpSchema(schema);
  let topLevelNodes = filteredSchema.definitions.top_level_node.items.anyOf;
  let nodeSchema = filteredSchema;

  /**
   * Generate and test random content for each top level node.
   */
  topLevelNodes.forEach(node => {
    nodeSchema.definitions.top_level_node.items.anyOf = [node];
    it(`should generate valid PM document for node: ${node.$ref}`, () => {
      for (let i = 0; i < 20; i++) {
        let valid = isJSONValid(
          jsf(nodeSchema),
          nodeSchema.definitions.top_level_node.items.anyOf.$ref,
        );
        expect(valid).toBe(true);
      }
    });
  });

  /**
   * Generate and test random content for all top level nodes together.
   */
  it('should generate valid PM document all top level nodes together', () => {
    for (let i = 0; i < 20; i++) {
      let valid = isJSONValid(jsf(filteredSchema), 'All top level nodes');
      expect(valid).toBe(true);
    }
  });
});
