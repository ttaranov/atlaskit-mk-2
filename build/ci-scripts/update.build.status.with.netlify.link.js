const fs = require('fs');
const path = require('path');
const updateBuildStatus = require('../utils/updateBuildStatus');
/**
 * NOTE
 * This script should be considered deprecated. We've left it here only as an example for
 * the future in case we want this functionality back.
 *
 * This functionality has moved to a static bitbucket addon as sending netlify links through
 * build status' during parallel steps can lead to other tools thinking builds are green when they
 * are not.
 */
const URL = process.env.URL;

if (!URL) {
  console.error('No url passed to script! Exiting');
  process.exit(1);
}

try {
  const buildStatusOpts = {
    buildName: 'Netlify build',
    description: 'A static preview build hosted on netlify',
    url: URL,
    state: 'SUCCESSFUL',
  };
  console.log('Updating build status...');
  updateBuildStatus(buildStatusOpts);
} catch (e) {
  console.error('Unable to update build status');
  console.error(e.toString());
}
