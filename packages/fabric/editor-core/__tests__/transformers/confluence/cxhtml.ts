describe('ConfluenceTransformer: encode - parse:', () => {
  test.skip(
    `Confluence transformer uses DOM to generate XHTML, but JSDOM does 
    not yet serialize to valid XHTML (see https://github.com/tmpvar/jsdom/issues/1839). 
    It is currently not feasible to run Confluence transformer tests in this environment.`,
  );
});
