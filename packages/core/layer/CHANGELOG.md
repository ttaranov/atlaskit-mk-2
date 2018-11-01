# @atlaskit/layer

## 5.0.9
- [patch] [b332c91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b332c91):

  - upgrades verison of react-scrolllock to SSR safe version

## 5.0.8
- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 5.0.7
- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 5.0.5
- [patch] Implement left offset position to fixed-position layer [8242529](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8242529)
- [none] Updated dependencies [8242529](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8242529)

## 5.0.4
- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)

## 5.0.3
- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/docs@5.0.2

## 5.0.2
- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)

## 5.0.1
- [patch] Schedule extractStyles function [b1e8a47](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1e8a47)
- [none] Updated dependencies [b1e8a47](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b1e8a47)

## 5.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/docs@5.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/docs@5.0.0

## 4.2.0
- [minor] Add optional onPositioned prop to inform when the menu has been positioned by the underlying Layer component. [95a4592](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95a4592)
- [minor] Updated dependencies [95a4592](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/95a4592)

## 4.1.1
- [patch] Replaces implementation of ScrollLock with [react-scrolllock](https://github.com/jossmac/react-scrolllock). Deprecates ScrollLock export in @atlaskit/layer-manager. [497d50d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/497d50d)
- [none] Updated dependencies [497d50d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/497d50d)

## 4.1.0
- [minor] Fixes types for Flow 0.74 [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
- [none] Updated dependencies [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)

## 4.0.3
- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)

## 4.0.2
- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/docs@4.1.1

## 4.0.1
- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/docs@4.1.0

## 4.0.0
- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/docs@4.0.0

## 3.2.0
- [minor] Add `isAwlwaysFixed` prop to force layered content to render with fixed position to break out of non-visible overflow containers at the cost of scroll detachment [4eb5378](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4eb5378)
- [none] Updated dependencies [e710cfa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e710cfa)
- [none] Updated dependencies [e20ac40](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e20ac40)
- [none] Updated dependencies [4eb5378](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4eb5378)

## 3.1.1
- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/docs@3.0.4

## 3.1.0
- [minor] Add lockScroll prop that locks all scrolling behind the layer when set to true. Also prevents any interaction behind the layer. Defaults to false. [96209c4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/96209c4)

## 3.0.0
- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 2.9.1
- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 2.9.0
- [minor]  Inline dialog the text is blurred [c73ed72](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c73ed72)

## 2.8.0
- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 2.7.2
- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 2.7.1
- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 2.7.0
- [minor] Updated inline-dialog to include boundaries element prop, updated Layer to have dynamic boolean escapeWithReference property, updated modal-dialog Content component with overflow-x:hidden' [cb72752](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cb72752)

## 2.6.1
- [patch] Mark packages as internal [016d74d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/016d74d)

## 2.6.0
- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 2.5.13
- [patch] prettier ignored popper, copied popper js [88e38de](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/88e38de)

## 2.5.12
- [patch] renamed popper.js to popper and index.min to index-min in popper js [06718c1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06718c1)

## 2.5.11
- [patch] added custom build to copy popper js [08c5c5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/08c5c5b)

## 2.5.10
- [patch] migrated layer from ak to mk-2 [3eec864](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3eec864)

## 2.5.9 (2017-12-06)
* bug fix; fix popper.js repaint flip issue caused by flaky native browser testing of MutationObs ([912dd87](https://bitbucket.org/atlassian/atlaskit/commits/912dd87))

## 2.5.8 (2017-11-27)
* bug fix; fix layer overflowing viewport bounded contents off the top or bottom (issues closed: ak-3887) ([5978bfb](https://bitbucket.org/atlassian/atlaskit/commits/5978bfb))

## 2.5.7 (2017-11-13)
* bug fix; Replaces popper.js with an inlined version directly in the layer package ([54fe9c2](https://bitbucket.org/atlassian/atlaskit/commits/54fe9c2))

## 2.5.6 (2017-10-22)
* bug fix; update styled component dependency and react peerDep ([39f3286](https://bitbucket.org/atlassian/atlaskit/commits/39f3286))

## 2.5.5 (2017-10-12)
* bug fix; fix issue where layer would flicker when Popper updated positioning (issues closed: ak-3600) ([379abba](https://bitbucket.org/atlassian/atlaskit/commits/379abba))

## 2.5.4 (2017-09-19)
* bug fix; support z-index on layer's content ([42f6b69](https://bitbucket.org/atlassian/atlaskit/commits/42f6b69))

## 2.5.3 (2017-08-09)
* bug fix; bump util-shared-styles dependency to latest to reduce app bundle sizes (issues closed: ak-3252) ([dbc406c](https://bitbucket.org/atlassian/atlaskit/commits/dbc406c))

## 2.5.2 (2017-07-27)
* fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 2.5.1 (2017-07-25)
* fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))


## 2.2.0 (2017-07-17)
* fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 2.2.0 (2017-07-17)
* feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 2.1.5 (2017-07-12)
* fix; sets the default state of Layer to put the content at -9999, -9999 to prevent flashe ([ef5d884](https://bitbucket.org/atlassian/atlaskit/commits/ef5d884))

## 2.1.4 (2017-05-30)
* fix; fixed default layer position ([d23ab52](https://bitbucket.org/atlassian/atlaskit/commits/d23ab52))
* fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))

## 2.1.3 (2017-05-02)
* fix; don't initialize Popper for empty layer ([67e34db](https://bitbucket.org/atlassian/atlaskit/commits/67e34db))

## 2.1.2 (2017-04-27)
* fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 2.1.1 (2017-04-26)
* fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 2.1.0 (2017-04-20)
* feature; removed explicit style! imports, set style-loader in webpack config ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))

## 2.0.2 (2017-04-18)
* fix; pins popper version to prevent breaking change that came in a minor change ([43ef9eb](https://bitbucket.org/atlassian/atlaskit/commits/43ef9eb))

## 2.0.1 (2017-04-04)
* fix; adds defensive code to allow testing in mocha/jsdom ([d6eddb8](https://bitbucket.org/atlassian/atlaskit/commits/d6eddb8))

## 2.0.0 (2017-03-27)
* fix; limit autoFlip positions to top, bottom, left, and right ([a2efa42](https://bitbucket.org/atlassian/atlaskit/commits/a2efa42))
* feature; add the ability to specify the order of flipping behavior to layer ([519283a](https://bitbucket.org/atlassian/atlaskit/commits/519283a))
* breaking; Replaced autoPosition property with the autoFlip property.

## 1.1.8 (2017-03-21)
* fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.1.7 (2017-02-28)
* fix; dummy commit to release stories ([3df5d9f](https://bitbucket.org/atlassian/atlaskit/commits/3df5d9f))

## 1.1.5 (2017-02-28)
* fix; dummy commit to fix broken stories and missing registry pages ([a31e92a](https://bitbucket.org/atlassian/atlaskit/commits/a31e92a))
* fix; dummy commit to release stories for components ([a105c02](https://bitbucket.org/atlassian/atlaskit/commits/a105c02))

## 1.1.4 (2017-02-28)
* fix; removes jsdoc annotations and adds them to usage.md ([40c986f](https://bitbucket.org/atlassian/atlaskit/commits/40c986f))

## 1.1.3 (2017-02-27)
* empty commit to make components release themselves ([5511fbe](https://bitbucket.org/atlassian/atlaskit/commits/5511fbe))

## 1.1.2 (2017-02-10)
* fix; Dummy commit to release components to registry ([5bac43b](https://bitbucket.org/atlassian/atlaskit/commits/5bac43b))

## 1.1.1 (2017-02-06)
* fix; Updates package to use scoped ak packages ([4800e90](https://bitbucket.org/atlassian/atlaskit/commits/4800e90))
