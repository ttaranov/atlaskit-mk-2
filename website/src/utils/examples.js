import React from 'react';
import sentenceCase from 'sentence-case';

function basename(path) {
  return path.split('/').pop();
}

function removeLeadingNumber(path) {
  return path.split('-')[1];
}

function removeSuffix(path) {
  return path.replace('.js', '');
}

export function formatExampleLink(name) {
  return basename(removeSuffix(name));
}

export function formatExampleName(name) {
  return sentenceCase(basename(removeLeadingNumber(removeSuffix(name))));
}

export function getExample(component, example) {
  return getRequireContext()(`./${component}/examples/${example}.js`).default;
}

export function filterExamplesByPackage(name) {
  return getRequireContext()
    .keys()
    .filter(e => e.indexOf(name) > -1);
}

export function getRequireContext() {
  return require.context('../../../components/', true, /.*\/examples\/.*\.js$/);
}
