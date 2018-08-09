const bolt = require('bolt');
const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const chalk = require('chalk');

async function getProjectsWithTSConfig(ws) {
  return (await Promise.all(
    ws.map(w =>
      readFile(path.join(w.dir, 'tsconfig.json'))
        .then(() => w)
        .catch(() => false),
    ),
  )).filter(Boolean);
}

function extractData(ws) {
  return ws.reduce((acc, w) => {
    acc[w.name] = {
      name: w.name,
      dir: w.dir,
      dependencies: Object.keys(w.config.dependencies),
      peerDependencies: Object.keys(w.config.peerDependencies || {}),
    };
    return acc;
  }, {});
}

function addReferences(tsProjects) {
  return Object.keys(tsProjects).map(name => {
    const pr = tsProjects[name];
    pr.references = [...pr.dependencies, ...pr.peerDependencies].reduce(
      (acc, dep) => {
        if (!tsProjects[dep]) return acc;
        acc.push({
          name: dep,
          path: path.relative(
            path.join(pr.dir, 'build', 'version'),
            tsProjects[dep].dir,
          ),
        });
        return acc;
      },
      [],
    );
    return pr;
  });
}

function updateTsConfig(version, tsProjects, allRefs) {
  return Promise.all(
    tsProjects.map(async pr => {
      const tsConfigPath = path.join(pr.dir, 'build', version, 'tsconfig.json');
      console.log(`  – ${tsConfigPath}`);
      const tsConfig = require(tsConfigPath);

      if (allRefs[pr.name]) {
        tsConfig.compilerOptions.composite = true;
      } else {
        delete tsConfig.compilerOptions.composite;
      }

      if (pr.references.length) {
        tsConfig.references = pr.references.map(ref => ({
          path: path.join(ref.path, 'build', 'es5', 'tsconfig.json'),
        }));
      }

      writeFile(tsConfigPath, JSON.stringify(tsConfig, null, 2));
    }),
  );
}

async function main() {
  console.log(chalk.blue('Building list of TypeScript projects...'));
  const wsWithTS = await getProjectsWithTSConfig(await bolt.getWorkspaces());
  console.log(wsWithTS.map(w => `  – ${w.name}`).join('\n'));

  console.log();
  console.log(chalk.blue('Building references...'));
  const tsProjectsWithRefs = addReferences(extractData(wsWithTS));

  console.log(chalk.blue('Building a list of referenced projects...'));
  const allRefs = tsProjectsWithRefs.reduce((acc, pr) => {
    pr.references.forEach(ref => {
      acc[ref.name] = true;
    });
    return acc;
  }, {});

  console.log();
  console.log(chalk.blue('Outputing es5 tsconfigs...'));
  await updateTsConfig('es5', tsProjectsWithRefs, allRefs);

  console.log();
  console.log(chalk.blue('Outputing es2015 tsconfigs...'));
  await updateTsConfig('es2015', tsProjectsWithRefs, allRefs);

  console.log();
  console.log(chalk.green('🏁 Done'));
}

// const doAThing = async () => {
//   const ws = await bolt.getWorkspaces();
//   let filteredWs;

//   if (process.argv[2]) {
//     filteredWs = ws.filter(obj => obj.name.startsWith(process.argv[2]));
//   }

//   filteredWs.filter(projObj => projObj.config.types).forEach(projObj => {
//     console.log('>>>', projObj.name);

//     const projDeps = {
//       ...projObj.config.dependencies,
//       ...projObj.config.peerDependencies,
//     };

//     const akProjDepsNames = Object.keys(projDeps).filter(name =>
//       name.startsWith('@atlaskit'),
//     );

//     akProjDepsNames.forEach(akProjDepName => {
//       const akDepObject = ws.find(projObj => projObj.name === akProjDepName);

//       if (akDepObject) {
//         if (akDepObject.config.types) {
//           const tsBuildDirPath = `${akDepObject.dir}/build/es5`;

//           if (fs.existsSync(tsBuildDirPath)) {
//             const tsConfigPath = `${tsBuildDirPath}/${
//               fs.readdirSync(`${tsBuildDirPath}`)[0]
//             }`;
//             console.log('Processing', tsConfigPath);

//             const tsConfig = require(tsConfigPath);
//             tsConfig.compilerOptions['rootDir'] = '../../src';
//             tsConfig.compilerOptions['composite'] = true;

//             fs.writeFileSync(
//               tsBuildDirPath + '/tsconfig.json',
//               JSON.stringify(tsConfig, null, 2),
//             );

//             const relPathFromThisTsToReferenced =
//               path.relative(
//                 path.resolve(`${projObj.dir}/build/es5`),
//                 `${tsBuildDirPath}`,
//               ) + '/tsconfig.json';
//             console.log('relative path', relPathFromThisTsToReferenced);

//             const thisTsConf5 = require(`${
//               projObj.dir
//             }/build/es5/tsconfig.json`);
//             const thisTsConf2015 = require(`${
//               projObj.dir
//             }/build/es2015/tsconfig.json`);

//             const refs = [
//               ...(thisTsConf5.references ? thisTsConf5.references : []),
//               ...(thisTsConf2015.references ? thisTsConf2015.references : []),
//               { path: relPathFromThisTsToReferenced },
//             ].filter(
//               (value, index, self) =>
//                 self.indexOf(self.find(obj => obj.path === value.path)) ===
//                 index,
//             );

//             thisTsConf5.references = refs;
//             thisTsConf2015.references = refs;

//             console.log(thisTsConf5.references);
//             console.log(thisTsConf2015.references);

//             fs.writeFileSync(
//               `${projObj.dir}/build/es5/` + '/tsconfig.json',
//               JSON.stringify(thisTsConf5, null, 2),
//             );
//             fs.writeFileSync(
//               `${projObj.dir}/build/es2015/` + '/tsconfig.json',
//               JSON.stringify(thisTsConf2015, null, 2),
//             );
//           }
//         }
//       }
//     });
//   });
// };

// doAThing();

main().catch(e => console.log(e));
