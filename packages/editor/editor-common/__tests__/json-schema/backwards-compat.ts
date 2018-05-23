import axios from 'axios';
import { validateSchemaCompatibility } from 'json-schema-diff-validator';
import * as newSchema from '../../json-schema/v1/full.json';
import { version } from '../../package.json';

// TODO: remove this when jest unit tests are supported for TS files
declare var expect: any;

const RED_START = '\u001b[31m';
const RED_END = '\u001b[39m';
const BOLD_START = '\u001b[1m';
const BOLD_END = '\u001b[22m';
const IMPORTANT_MESSAGE_START = `${RED_START}${BOLD_START}`;
const IMPORTANT_MESSAGE_END = `${BOLD_END}${RED_END}`;

async function fetchJSONSchema(version: string) {
  const url = `https://unpkg.com/@atlaskit/editor-common@${version}/dist/json-schema/v1/full.json`;
  const res = await axios.get(url);

  return res.data;
}

function fetchLatestJSONSchema() {
  return fetchJSONSchema('latest');
}

expect.extend({
  toBeBackwardsCompatibleWith(received: any, argument: any) {
    try {
      validateSchemaCompatibility(argument, received, {
        allowNewOneOf: true,
        allowNewEnumValue: true,
      });

      return {
        pass: true,
      };
    } catch (ex) {
      return {
        message: () => ex.message,
        pass: false,
      };
    }
  },
});

describe('JSON schema', () => {
  it('should be backwards compatible', async () => {
    let existingSchema: any;

    try {
      existingSchema = await fetchJSONSchema(version);
    } catch (err) {
      // if package with this version doesn't exist test against the latest version
      // this can happen when you manually bump version in package.json
      if (!err.response || err.response.status !== 404) {
        throw new Error(
          `JSON schema fetch error (version ${version}): ${err.message}`,
        );
      }

      existingSchema = await fetchLatestJSONSchema();
    }

    try {
      expect(newSchema).toBeBackwardsCompatibleWith(existingSchema);
    } catch (ex) {
      throw new Error(
        'JSON schema backwards compatibility test failed. ' +
          `${IMPORTANT_MESSAGE_START}Have you tried rebasing your current branch against target branch?${IMPORTANT_MESSAGE_END}\n` +
          ex.message,
      );
    }
  });
});
