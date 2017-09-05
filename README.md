# AtlasKit MK II

This is a spike of the potential new build system to be shared by AtlasKit, Media and Fabric

## Getting started

You'll need `node@8.1.4` with `yarn` and `pyarn` installed globally:

```
nvm install 8.1.4
```

```
npm i -g yarn pyarn
```

Then install dependencies for AtlasKit MK II:

```
pyarn install
```

## Developing

```
yarn start
```

This will start webpack and serve the website on [localhost:9000](http://localhost:9000/)

## Building

```
yarn run build
```

This will build all the tests for all the packages in the repo

# Testing

```
yarn run test
```

This will run jest for all the packages in the repo
