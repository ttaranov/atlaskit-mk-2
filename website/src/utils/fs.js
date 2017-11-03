// @flow
import type { Directory, File } from '../types';
import sentenceCase from 'sentence-case';

export function getDirectories(items: Array<Directory | File>): Array<Directory> {
  let dirs = [];

  for (let item of items) {
    if (item.type === 'dir') {
      dirs.push(item);
    }
  }

  return dirs;
}

export function getFiles(items: Array<Directory | File>): Array<File> {
  let files = [];

  for (let item of items) {
    if (item.type === 'file') {
      files.push(item);
    }
  }

  return files;
}

export function maybeGetById<T: Directory | File>(items: Array<T>, id: string): T | null {
  return items.find(item => item.id === id) || null;
}

export function getById<T: Directory | File>(items: Array<T>, id: string): T {
  let match = maybeGetById(items, id);

  if (!match) {
    throw new Error(`Missing ${id} in file system`);
  }

  return match;
}

export function flatMap<T>(dir: Directory, iteratee: (file: File, filePath: string) => T): Array<T> {
  let result = [];

  function visit(dir, filePath) {
    for (let item of dir.children) {
      let currPath = `${filePath}/${item.id}`;
      if (item.type === 'dir') {
        visit(item, currPath);
      } else {
        result.push(iteratee(item, currPath));
      }
    }
  }

  visit(dir, dir.id);

  return result;
}

export function find(dir: Directory, iteratee: (file: File, filePath: string) => boolean): File | null {
  function visit(dir, filePath) {
    for (let item of dir.children) {
      let currPath = `${filePath}/${item.id}`;
      if (item.type === 'dir') {
        let result = visit(item, currPath);
        if (result) return result;
      } else {
        if (iteratee(item, currPath)) return item;
      }
    }
  }

  return visit(dir, dir.id) || null;
}

export function findNormalized(dir: Directory, filePath: string) {
  return find(dir, (file, currPath) => {
    return normalize(currPath) === filePath;
  });
}

export function normalize(filePath: string): string {
  return filePath.split('/').map(part => {
    return part.replace(/^[\d]+-/, '');
  }).join('/').replace(/\..*/, '');
}

export function titleize(filePath: string): string {
  return sentenceCase(normalize(filePath));
}
