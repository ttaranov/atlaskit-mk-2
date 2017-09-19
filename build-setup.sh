#!/usr/bin/env bash

curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 0.23.2
export PATH=$HOME/.yarn/bin:$PATH

yarn global add pyarn

# These are used to sign commits when pushing back to Bitbucket
# No auth is required as we use ssh from pipelines instead
git config --global user.email "$BOT_ACCOUNT_EMAIL"
git config --global user.name "$BOT_ACCOUNT_NAME"
git config --global push.default simple

# $NPM_TOKEN is the auth token for the "atlaskit" user
npm set //registry.npmjs.org/:_authToken=$NPM_TOKEN

# This gives us colored output in Pipelines
export FORCE_COLOR=1
yarn config set color always
