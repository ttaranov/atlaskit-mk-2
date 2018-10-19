Changesets now use local file system - this has several effects:

1. Changesets will no longer automatically create a commit. You will need to add and commit the files yourself.
2. Changesets are easier to modify. You should ONLY modify the changes.md file (*Not changes.json*).
3. There will be a new directory which is `.changeset`, which will hold all the changesets.

Apart from these changes, your process using this should not have changed.

Changeset now accepts skipCI flag, where previously release commits automatically skipped CI. i.e.

```
yarn build-releases version --skipCI
```

**Breaking**: Changeset and version commands now accept `--commit` flag which makes them commit automatically (previously this was the default behaviour). Otherwise, these commands simply make the file-system changes.

```
yarn build-releases changeset --commit
```

We also introduce the `intitialize` command. See the package [README.md](https://www.npmjs.com/package/@atlaskit/build-releases) for more details about this.
