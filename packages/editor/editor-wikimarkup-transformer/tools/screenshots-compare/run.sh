#!/bin/bash

set -e

cd "$(dirname "$0")/../../"

if [ -z "$TOKEN" ]; then
  echo "TOKEN environment variable is not set"
  exit 1
fi

rm -fr tools/screenshots-compare/assets
mkdir tools/screenshots-compare/assets

node tools/screenshots-compare/fetch-jira-issues.js
tsc && node tools/screenshots-compare/wikimarkup-to-adf.js

DEBUG=tab* TABS_IN_PARALLEL=1 node tools/screenshots-compare/screenshot-parser-adf.js
node tools/screenshots-compare/screenshots-to-base64.js

DEBUG=tab* TABS_IN_PARALLEL=1 node tools/screenshots-compare/screenshot-jira-cloud.js
node tools/screenshots-compare/screenshots-to-base64.js

open tools/screenshots-compare/result.html
