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
  groupId: string,
  packageId: string,
  exampleId: string,
) => {
  const baseUrl =
    process.env.NODE_ENV === 'development' ? 'http://localhost:9001/' : '/';
  return `${baseUrl}examples.html?groupId=${groupId}&packageId=${packageId}&exampleId=${exampleId}`;
};
