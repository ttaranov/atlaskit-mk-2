//@flow
'use strict';
/*
* server side renderer utilities helper to return all the examples and filter by packages
*/
import Loadable from 'react-loadable';
const glob = require('glob');

// get all examples from the code sync
function getAllExamplesSync() /*: Array<Object> */ {
  return glob
    .sync('**/packages/**/examples/*.+(js|ts|tsx)', {
      ignore: '**/node_modules/**',
    })
    .map(file => {
      const reverseExamplePath = file.split('/').reverse();
      return {
        team: reverseExamplePath[3],
        package: reverseExamplePath[2],
        exampleName: reverseExamplePath[0]
          .replace('.js', '')
          .replace('.tsx', '')
          .replace(/^\d+\-\s*/, ''),
      };
    });
}
async function getFileContent(example: string) /*: any */ {
  return Loadable({
    // $FlowFixMe
    loader: () => import(example),
    loading() {
      // $FlowFixMe
      return <div>Loading...</div>;
    },
  });
}

function getExamplesFor(pkgName /*: string */) /*: Array<Object> */ {
  return getAllExamplesSync().filter(obj => obj.package === pkgName);
}

module.exports = { getExamplesFor, getFileContent };
