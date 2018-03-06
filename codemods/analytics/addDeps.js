#!/usr/bin/env node
/**
 * Adds @atlaskit/analytics-next dep to all analytics package
 * Note this is not a codemod
 */

const { spawn } = require('child_process');


const { analyticsPackages } = require('./analyticsEventMap');

const packageStr = analyticsPackages.join(',');

const child = spawn('bolt', ['workspaces', 'exec', '--only-fs', `packages/elements/{${packageStr}}`, '--', 'bolt', 'add', '@atlaskit/analytics-next']);

child.stdout.on('data', chunk => {
  console.log(chunk.toString());
});

child.on('close', code => {
  if (code !== 0) {
    throw new Error(`Bolt command was not successful, exited with code ${code}`);
  }
});
child.on('error', err => {
  throw new Error('Bolt command error', err);
});