import { parseFile, replaceImport } from 'react-codesandboxer';

const getBBPath = (
  path,
  accountName = 'atlassian',
  repoSlug = 'atlaskit-mk-2',
  // NB: This can totally be a reference to a branch name, not just git hashes
  revision = 'HEAD',
) =>
  `https://api.bitbucket.org/1.0/repositories/${accountName}/${repoSlug}/raw/${revision}/${path}`;

const getFileFromBitBucket = (
  path,
  accountName = 'atlassian',
  repoSlug = 'atlaskit-mk-2',
  // NB: This can totally be a reference to a branch name, not just git hashes
  revision = 'HEAD',
) => {
  const a = `https://api.bitbucket.org/1.0/repositories/${accountName}/${repoSlug}/raw/${revision}/${path}`;

  return fetch(a);
};

/*
This is modified from the canvase answer here: https://stackoverflow.com/questions/6150289/how-to-convert-image-into-base64-string-using-javascript
*/

function toDataURL2(src) {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = getBBPath(src);

    img.onload = function() {
      var canvas = document.createElement('CANVAS');
      var ctx = canvas.getContext('2d');
      var dataURL;
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL();
      resolve(dataURL);
    };
  });
}

const parseDependencies = (
  loadedExample,
  groupId,
  packageId,
  exampleId,
  pkgJSON,
) => {
  let simpleImports = false;
  let trickyImports = false;

  const mptsToResolve = [];
  const nonJSFiles = [];
  return parseFile(loadedExample, pkgJSON).then(({ file, internalImports }) => {
    for (const mpt of internalImports) {
      const [complete, source] = mpt;

      if (/^\.\.\//.test(source)) {
        // If we are trying to deploy things from places other than the source,
        // we will not be able to reference them. Do not let this example be
        // deployed to codesandbox
        trickyImports = true;
      } else if (/^\.\//.test(source)) {
        // This is if it is another file in the examples directory. We want
        // to handle this, but not at first implementation
        let sourceA = source.replace('./', '');
        if (/\.\w/.test(sourceA)) {
          let segments = ['packages', groupId, packageId, 'examples', sourceA];
          let path = `${segments.join('/')}`;

          nonJSFiles.push(
            toDataURL2(path).then(content => ({ name: sourceA, content })),
          );
          // This is a slight stop-gap that won't catch all files. We are assuming
          // all imports are either .js or images
          // TODO: Check the file type more carefully
        } else {
          // we will also need to handle json...
          sourceA += '.js';

          const segments = [
            'packages',
            groupId,
            packageId,
            'examples',
            sourceA,
          ];
          const path = `${segments.join('/')}`;
          mptsToResolve.push(
            getFileFromBitBucket(path)
              .then(a => a.text())
              .then(content => parseFile(content, pkgJSON))
              .then(c => ({ ...c, name: sourceA })),
          );
          simpleImports = true;
        }
      }
    }

    return Promise.all([
      Promise.all(mptsToResolve),
      Promise.all(nonJSFiles),
    ]).then(([parsedFile, nonJSFiles2]) => {
      const extraFiles = {};
      let extraImports = {};
      for (const res of parsedFile) {
        if (!trickyImports) {
          if (res.internalImports.lenght > 0) {
            trickyImports = true;
          } else {
            extraImports = { ...extraImports, ...res.deps };
            extraFiles[res.name] = { content: res.exampleCode };
          }
        }
      }

      for (const res of nonJSFiles2) {
        extraFiles[res.name] = { content: res.content };
      }

      return {
        extraFiles,
        extraImports,
        simpleImports,
        trickyImports,
      };
    });
  });
};

const csbLoading = (example, groupId, packageId, pkgJSON) =>
  example.contents().then(fileContents => {
    const loadedExample = replaceImport(fileContents, '../src', pkgJSON.name);

    return parseDependencies(
      loadedExample,
      groupId,
      packageId,
      example.Id,
      pkgJSON,
    ).then(res => {
      return { loadedExample, ...res };
    });
  });

export default csbLoading;
