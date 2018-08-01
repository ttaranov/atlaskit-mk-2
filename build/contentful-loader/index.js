const contentful = require('contentful');
const loaderUtils = require('loader-utils');

module.exports = async function contentfulLoader() {
  let contenfulPages = {};
  const opts /*: LoaderOptions */ = Object.assign(
    { spaceId: '', accessToken: '' },
    loaderUtils.getOptions(this) || {},
  );

  let client = contentful.createClient({
    space: opts.spaceId,
    accessToken: opts.accessToken,
  });

  const pages = await client.getEntries({
    content_type: 'pages',
  });

  pages.items.forEach(({ fields, sys }) => {
    contenfulPages[fields.slug] = {
      title: fields.title,
      id: sys.id,
    };
  });
  console.log(contenfulPages);

  //contenfulPages = pages.items.map(page => )

  return `export default ${JSON.stringify(contenfulPages)}`;
};
