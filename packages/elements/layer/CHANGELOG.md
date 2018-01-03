# @atlaskit/layer

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

## 2.2.0 (2017-07-17)

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

## 1.1.8 (2017-03-21)


* fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.1.7 (2017-02-28)


* fix; dummy commit to release stories ([3df5d9f](https://bitbucket.org/atlassian/atlaskit/commits/3df5d9f))

## 1.1.5 (2017-02-28)


* fix; dummy commit to fix broken stories and missing registry pages ([a31e92a](https://bitbucket.org/atlassian/atlaskit/commits/a31e92a))

## 1.1.5 (2017-02-28)


* fix; dummy commit to release stories for components ([a105c02](https://bitbucket.org/atlassian/atlaskit/commits/a105c02))

## 1.1.4 (2017-02-28)


* fix; removes jsdoc annotations and adds them to usage.md ([40c986f](https://bitbucket.org/atlassian/atlaskit/commits/40c986f))

## 1.1.3 (2017-02-27)


* empty commit to make components release themselves ([5511fbe](https://bitbucket.org/atlassian/atlaskit/commits/5511fbe))

## 1.1.2 (2017-02-10)


* fix; Dummy commit to release components to registry ([5bac43b](https://bitbucket.org/atlassian/atlaskit/commits/5bac43b))

## 1.1.1 (2017-02-06)


* fix; Updates package to use scoped ak packages ([4800e90](https://bitbucket.org/atlassian/atlaskit/commits/4800e90))
