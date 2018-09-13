## ak-i18n

This is a tool for extract, pulling and pushing i18n translation strings from React components.

It works using the [babel-plugin-react-intl](https://github.com/yahoo/babel-plugin-react-intl) and [babel-plugin-react-intl-pot](https://www.npmjs.com/package/babel-plugin-react-intl-pot) to create `translation.pot` files for a package.

Some notes to consider:

* This tool will technically work on `JS` packages `src/` files, but will not work in `Typescript` `src/` files. For that reason, we reccomend pointing it at the built `dist` directories instead.
* The `dist` files **need** to have import statements in them for this tool to pick up the messages. That means using `dist/esm` for `flow` packages and `dist/es2015` for `Typescript` packages.

### Usage

```
  $ ak-i18n <command> path/to/package
```

**Options**

`--searchDir`  Override the default directory that ak-i18n will search in when extracting translation strings (relative to the package you point to)

`--cwd`        Override the current working directory

**Examples**

```
$ ak-i18n extract packages/search/global-search
$ ak-i18n push packages/search/global-search
$ ak-i18n pull packages/search/global-search

$ ak-i18n extract packages/core/avatar --searchDir dist/esm
```

Full and up to date usage info can be found by running the tool with the `--help` flag.
