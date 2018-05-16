'use strict';

const assert = require('assert');
const cookie = require('cookie');
const { writeFileSync } = require('fs');
const got = require('got');

const ISSUES_LIMIT = 100;

async function getPageResults(page) {
  const startAt = (page - 1) * 100;
  const url = `https://product-fabric.atlassian.net/rest/api/2/search?startAt=${startAt}&maxResults=100&fields=description&jql=project=ED`;
  console.warn(`Fetching page ${page}: ${url}`);

  let res;
  try {
    res = await got(url, {
      headers: {
        cookie: cookie.serialize('cloud.session.token', process.env.TOKEN, {
          domain: '.atlassian.net',
          httpOnly: true,
          secure: true,
        }),
      },
      json: true,
    });
  } catch (err) {
    console.warn(`Could not fetch issues: ${err.message}`);
    throw err;
  }

  const { body } = res;
  const output = new Map();

  for (const issue of body.issues) {
    output.set(issue.key, issue.fields.description);
  }

  return output;
}

function mergeMaps(target, src) {
  for (const [key, value] of src) {
    target.set(key, value);
  }
}

async function getWikiChunks(num) {
  const output = new Map();
  let page = 1;

  while (output.size < num) {
    const data = await getPageResults(page);

    if (!data.size) {
      break;
    }

    mergeMaps(output, data);
    page++;
  }

  return output;
}

function prepareKV(map) {
  const output = {};
  const tmp = [];

  for (const [key, value] of map) {
    if (value) {
      tmp.push({ key, value });
    }
  }

  tmp.sort(() => (Math.random() > 0.5 ? -1 : 1));
  tmp.length = ISSUES_LIMIT;

  tmp.sort((a, b) => {
    const aKey = Number(a.key.substr(3));
    const bKey = Number(b.key.substr(3));

    return aKey - bKey;
  });

  for (const { key, value } of tmp) {
    output[key] = value;
  }

  return output;
}

async function main() {
  assert(
    process.env.TOKEN,
    'TOKEN environment variable is not specified. Use `cloud.session.token` cookie value for it',
  );

  const wiki = await getWikiChunks(10000);
  const kv = prepareKV(wiki);

  const tasksJSFilePath = `${__dirname}/assets/tasks.js`;
  console.warn(`Write fetched wiki markup to JS ${tasksJSFilePath}`);
  writeFileSync(tasksJSFilePath, `tasks = ${JSON.stringify(kv, null, 2)}`);

  const tasksJSONFilePath = `${__dirname}/assets/tasks.json`;
  console.warn(`Write fetched wiki markup to JSON file ${tasksJSONFilePath}`);
  writeFileSync(tasksJSONFilePath, JSON.stringify(kv, null, 2));
}

process.on('unhandledRejection', reason => {
  console.error('Unhaldled promise rejection: %s', reason.stack);
  process.exit(1);
});

process.on('uncaughtException', err => {
  console.error('Uncaught exception: %s', err.message);
});

main();
