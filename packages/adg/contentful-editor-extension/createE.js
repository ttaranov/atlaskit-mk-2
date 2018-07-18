'use strict';
const bolt = require('bolt');
const globby = require('globby');
const fs = require('fs');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);

async function doingStuffHere() {
  const projectDir = (await bolt.getProject({
    cwd: process.cwd(),
  })).dir;
  const files /*: Array<string> */ = await globby(
    [
      'packages/**/examples/*',
      '!packages/**/node_modules/**',
      '!node_modules/**',
    ],
    {
      cwd: projectDir,
    },
  );

  const temp = [];
  files.forEach((exampleFile, index) => {
    console.log(exampleFile);
    temp.push({
      component: `../../../${exampleFile}`,
      key: index,
    });
    //  await writeFile(`${__dirname}/test.js`, temp)
  });
  //console.log(temp)
  await writeFile(`${__dirname}/test.js`, JSON.stringify(temp));
}

doingStuffHere().then(() => console.log('its done'));
