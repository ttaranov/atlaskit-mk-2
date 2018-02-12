### In atlaskit-mk-2:
```
bolt
bolt build
cd packages/fabric/editor-core
rm -rf node_modules
npm install
npm link
```

### In editor-bundle
```
npm link @atlaskit/editor-core
npm run build
```
