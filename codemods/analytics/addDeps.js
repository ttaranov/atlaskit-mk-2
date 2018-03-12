#!/usr/bin/env node
/**
 * Adds @atlaskit/analytics-next dep to all analytics package
 * Note this is not a codemod
 */

const { spawnSync } = require('child_process');


const { analyticsPackages } = require('./analyticsEventMap');

const packageStr = analyticsPackages.join(',');

[{ name: '@atlaskit/analytics-next' }, { name: 'enzyme', flag: '--dev' }].forEach( pkg => {
  let args = ['workspaces', 'exec', '--only-fs', `packages/core/{${packageStr}}`, '--', 'bolt', 'add', pkg.name];
  if (pkg.flag) {
    args.push(pkg.flag);
  }
  const child = spawnSync('bolt',
    args,
    { stdio: 'pipe', encoding: 'utf-8' }
  );

  console.log(child.output.join('\n'));

  if (child.status !== 0) {
    throw new Error(`Bolt command was not successful, exited with code ${child.status} with args ${args}`);
  }

  if (child.error) {
    throw new Error('Bolt command error', child.error);
  }
});