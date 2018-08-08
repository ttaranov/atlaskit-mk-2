const bolt = require('bolt');
const fs = require('fs');
const path = require('path');

const doAThing = async () => {
  const ws = await bolt.getWorkspaces();
  let filteredWs;

  if (process.argv[2]) {
    filteredWs = ws.filter(obj => obj.name.startsWith(process.argv[2]));
  }

  filteredWs.filter(projObj => projObj.config.types).forEach(projObj => {
    console.log('>>>', projObj.name);

    const projDeps = {
      ...projObj.config.dependencies,
      ...projObj.config.peerDependencies,
    };

    const akProjDepsNames = Object.keys(projDeps).filter(name =>
      name.startsWith('@atlaskit'),
    );

    akProjDepsNames.forEach(akProjDepName => {
      const akDepObject = ws.find(projObj => projObj.name === akProjDepName);

      if (akDepObject) {
        if (akDepObject.config.types) {
          const tsBuildDirPath = `${akDepObject.dir}/build/es5`;

          if (fs.existsSync(tsBuildDirPath)) {
            const tsConfigPath = `${tsBuildDirPath}/${
              fs.readdirSync(`${tsBuildDirPath}`)[0]
            }`;
            console.log('Processing', tsConfigPath);

            const tsConfig = require(tsConfigPath);
            tsConfig.compilerOptions['rootDir'] = '../../src';
            tsConfig.compilerOptions['composite'] = true;

            fs.writeFileSync(
              tsBuildDirPath + '/tsconfig.json',
              JSON.stringify(tsConfig, null, 2),
            );

            const relPathFromThisTsToReferenced =
              path.relative(
                path.resolve(`${projObj.dir}/build/es5`),
                `${tsBuildDirPath}`,
              ) + '/tsconfig.json';
            console.log('relative path', relPathFromThisTsToReferenced);

            const thisTsConf5 = require(`${
              projObj.dir
            }/build/es5/tsconfig.json`);
            const thisTsConf2015 = require(`${
              projObj.dir
            }/build/es2015/tsconfig.json`);

            const refs = [
              ...(thisTsConf5.references ? thisTsConf5.references : []),
              ...(thisTsConf2015.references ? thisTsConf2015.references : []),
              { path: relPathFromThisTsToReferenced },
            ].filter(
              (value, index, self) =>
                self.indexOf(self.find(obj => obj.path === value.path)) ===
                index,
            );

            thisTsConf5.references = refs;
            thisTsConf2015.references = refs;

            console.log(thisTsConf5.references);
            console.log(thisTsConf2015.references);

            fs.writeFileSync(
              `${projObj.dir}/build/es5/` + '/tsconfig.json',
              JSON.stringify(thisTsConf5, null, 2),
            );
            fs.writeFileSync(
              `${projObj.dir}/build/es2015/` + '/tsconfig.json',
              JSON.stringify(thisTsConf2015, null, 2),
            );
          }
        }
      }
    });
  });
};

doAThing();
