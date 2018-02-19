// @flow
import * as fs from './fs';
import { packages as packagesData } from '../site';

export default (groupId?: string, packageId?: string, exampleId?: string) => {
  let groups = fs.getDirectories(packagesData.children);
  let resolvedGroupId = groupId || groups[0].id;
  let group = fs.getById(groups, resolvedGroupId);
  let packages = fs.getDirectories(group.children);
  let resolvedPackageId = packageId || packages[0].id;
  let pkg = fs.getById(packages, resolvedPackageId);

  let examples = fs.maybeGetById(fs.getDirectories(pkg.children), 'examples');
  let example;

  if (examples) {
    example = fs.find(examples, file => {
      if (exampleId) {
        return fs.normalize(file.id) === exampleId;
      } else {
        return true;
      }
    });
  }

  let resolvedExampleId = example ? example.id : null;

  let hasChanged =
    groupId !== resolvedGroupId ||
    packageId !== resolvedPackageId ||
    (exampleId || null) !==
      (resolvedExampleId ? fs.normalize(resolvedExampleId) : null);

  return {
    hasChanged,
    groups,
    packages,
    examples,
    example,
    groupId: resolvedGroupId,
    packageId: resolvedPackageId,
    exampleId: resolvedExampleId,
  };
};

export const getLoaderUrl = (
  groupId?: string,
  packageId?: string,
  exampleId?: string,
) => {
  if (!groupId || !packageId || !exampleId) {
    console.error(`Warning missing parameter: Please ensure that you have passed in the correct arguments:
      \n  groupId: ${String(groupId)}
      \n  packageId: ${String(packageId)}
      \n  exampleId: ${String(exampleId)}
    `);
    return null;
  }
  return `/examples.html?groupId=${groupId}&packageId=${packageId}&exampleId=${exampleId}`;
};
