const { promisify } = require('util');
const Transifex = require('transifex');
const { errorAndExit } = require('./index');

const TRANSIFEX_PROJECT_NAME = 'atlaskit';
const { TRANSIFEX_API_TOKEN } = process.env;

const checkTransifexEnvVar = () => {
  if (!TRANSIFEX_API_TOKEN) {
    errorAndExit(
      'TRANSIFEX_API_TOKEN is missing. This env var is required for accessing Transifex',
    );
  }
};

const transifex = new Transifex({
  project_slug: TRANSIFEX_PROJECT_NAME,
  credential: `api:${TRANSIFEX_API_TOKEN}`,
});

const pushTranslations = (project, resource, content) =>
  promisify(transifex.uploadSourceLanguageMethod.bind(transifex))(
    project,
    resource,
    {
      slug: resource,
      name: resource + '.pot',
      i18n_type: 'PO',
      content,
    },
  );

const getAvailableLanguages = (project, resource) =>
  promisify(transifex.resourcesInstanceMethods.bind(transifex))(
    project,
    resource,
  ).then(data => data.available_languages);

const getTranslations = promisify(
  transifex.translationInstanceMethod.bind(transifex),
);

module.exports = {
  TRANSIFEX_PROJECT_NAME,
  checkTransifexEnvVar,
  pushTranslations,
  getAvailableLanguages,
  getTranslations,
};
