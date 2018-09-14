## i18n-tools

This is a tool for extracting, pulling and pushing i18n translation strings from React components.

It works using the [babel-plugin-react-intl](https://github.com/yahoo/babel-plugin-react-intl), [babel-plugin-react-intl-pot](https://npm.im/babel-plugin-react-intl-pot) and [transifex](https://npm.im/transifex) to generate POT and push it to Transifex.

Some notes to consider:

* This tool expects a `TRANSIFEX_API_TOKEN` environment variable. You can obtain a token from [here](https://www.transifex.com/user/settings/api/).
* This tool will technically work on `JS` packages `src/` files, but will not work in `Typescript` `src/` files. For that reason, we recommend pointing it at the built `dist` directories instead.
* The `dist` files **need** to have import statements in them for this tool to pick up the messages. That means using `dist/esm` for `flow` packages and `dist/es2015` for `Typescript` packages.

Usage info can be found by running the tool with the `--help` flag.
