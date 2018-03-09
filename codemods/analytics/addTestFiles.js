#!/usr/bin/env node
/**
 * Adds non-existing test files from analyticsEventMap.js so codemods can operate on them
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');


const { analyticsEventMap } = require('./analyticsEventMap');

analyticsEventMap.forEach( pkg => {
  if (pkg.path.indexOf('testfixtures') >= 0) {
    return;
  }
  const testPath = path.resolve(__dirname, '..', '..', 'packages', 'elements', pkg.testPath);
  const child = spawnSync('touch',
    [testPath],
    { stdio: 'pipe', encoding: 'utf-8' }
  );
  console.log(child.output.join('\n'));

  if (child.status !== 0) {
    throw new Error(`Touch command was not successful, exited with code ${child.status}`);
  }

  if (child.error) {
    throw new Error('Touch command error', child.error);
  }

  // Cannot add comments via jscodeshift...have to add here
  fs.writeFileSync(testPath, `// @flow
import { withAnalyticsEvents, withAnalyticsContext, createAndFireEvent } from '@atlaskit/analytics-next';
`, 'utf8');
});