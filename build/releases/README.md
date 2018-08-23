## Build Releases

Standalone library to help monorepos that are using bolt to bump version across whole monorepo (especially those internal ones). Heavily depends on bolt and git to generate and bump versions.

## Commands

### changeset

```
build-releases changeset
```
Launches interactive changeset commit creation. 

Changeset is a commit message describing which packages should be bumped along with it's dependants. Also describes how to bump them: patch, minor, major version. By convention changeset commits do not contain any actual file changes. 

Example of changeset commit message:
```
CHANGESET: removed promise from FabricAnalyticsListener.client property

Summary: removed promise from FabricAnalyticsListener.client property

Release notes: <none>

Releases: @atlaskit/analytics-listeners@major, @atlaskit/website@patch

Dependents: @atlaskit/global-navigation@patch, @atlaskit/navigation-next@patch, @atlaskit/conversation@patch, @atlaskit/analytics-namespaced-context@patch

---
{"summary":"removed promise from FabricAnalyticsListener.client property","releases":[{"name":"@atlaskit/analytics-listeners","type":"major"},{"name":"@atlaskit/website","type":"patch"}],"dependents":[{"name":"@atlaskit/global-navigation","type":"patch","dependencies":["@atlaskit/navigation-next","@atlaskit/analytics-namespaced-context","@atlaskit/analytics-listeners"]},{"name":"@atlaskit/navigation-next","type":"patch","dependencies":["@atlaskit/global-navigation","@atlaskit/analytics-namespaced-context","@atlaskit/analytics-listeners"]},{"name":"@atlaskit/conversation","type":"patch","dependencies":["@atlaskit/analytics-listeners"]},{"name":"@atlaskit/analytics-namespaced-context","type":"patch","dependencies":["@atlaskit/analytics-listeners"]}]}
---
```

### version

```
build-releases version [--withChangelog]
```
Creates release commit with bumped versions for all packages (and depdendencies) described in changeset commits since last release. Should be part of release process on CI.

`--withChangelog` - enables generation of changelog file (or if it exists appends new version changelog on the top of current file)

Example of commit message:

```
RELEASING: Releasing 2 package(s)

Releases:
  @atlaskit/icon@13.3.0
  @atlaskit/reduced-ui-pack@9.2.0

Dependents:
  []

Deleted:
  []

---
{"releases":[{"name":"@atlaskit/icon","commits":["d36f760","7cf05b3"],"version":"13.3.0"},{"name":"@atlaskit/reduced-ui-pack","commits":["d36f760","365460a"],"version":"9.2.0"}],"changesets":[{"commit":"d36f760","summary":"Add new icon"},{"commit":"365460a","summary":"Add new icon for Roadmap"},{"commit":"7cf05b3","summary":"Add new icon for Roadmap"}]}
---

[skip ci]
```
### publish

```
build-releases publish
```

Publishes to NPM repo, tags and git pushes release commit. Because this command assumes that last commit is the release commit you should not commit any changes between calling `version` and `publish`. These commands are separate to enable you to check if release commit is acurate. Should be part of release process on CI.
