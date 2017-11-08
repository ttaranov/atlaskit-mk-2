const info = require('bolt/dist/legacy/utils/npm').info;

async function infoAllow404(pkgName) {
  try {
    const pkgInfo = await info(pkgName);
    return { published: true, pkgInfo };
  } catch (error) {
    const output = JSON.parse(error.stdout);
    if (output.error && output.error.code === 'E404') {
      return { published: false, pkgInfo: {} };
    }
    throw error;
  }
}

infoAllow404('@atlaskit/blalbllalall')
  .then(console.log)
  .catch(console.error);
