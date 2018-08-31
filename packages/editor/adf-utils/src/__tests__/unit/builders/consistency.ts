/// <reference path="./_types.d.ts" />

import * as fs from 'fs';
import * as path from 'path';

declare var __dirname: string;

const buildFilesList = (dirPath: string, ignored: Array<string> = []) =>
  fs
    .readdirSync(dirPath)
    .filter(node => !node.startsWith('.'))
    .map(node => path.basename(node, path.extname(node)))
    .filter(node => ignored.indexOf(node) === -1 && node !== 'index');

const ignoredNodes = [
  'applicationCard',
  'confluence-jira-issue',
  'confluence-unsupported-block',
  'confluence-unsupported-inline',
  'unsupported-block',
  'unsupported-inline',
  'unknown-block',
  'tableNodes',
  'table-cell',
  'table-header',
  'table-row',
  'table',
  'image',
];

const editorCommonNodesPath = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  '..',
  'editor-common',
  'src',
  'schema',
  'nodes',
);

const nodeBuildersPath = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'builders',
  'nodes',
);

const ignoredMarks = [
  'confluence-inline-comment',
  'emoji-query',
  'mention-query',
  'type-ahead-query',
];

const editorCommonMarksPath = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  '..',
  'editor-common',
  'src',
  'schema',
  'marks',
);

const marksBuildersPath = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'builders',
  'marks',
);

describe('adf-utils <-> editor-common/schema consistency', () => {
  it('should have builders for all nodes from editor-common/schema/nodes', () => {
    const nodes = buildFilesList(editorCommonNodesPath, ignoredNodes);
    const builders = buildFilesList(nodeBuildersPath, ignoredNodes);
    expect(builders).toEqual(nodes);
  });

  it('should have builders for all marks from editor-common/schema/marks', () => {
    const marks = buildFilesList(editorCommonMarksPath, ignoredMarks);
    const builders = buildFilesList(marksBuildersPath);
    expect(builders).toEqual(marks);
  });
});
