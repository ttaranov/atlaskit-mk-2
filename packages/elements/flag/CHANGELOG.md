# @atlaskit/flag

## 6.1.8 (2017-11-22)

* bug fix; long messages in Flags start to wrap, not overflow content. ([b69c45f](https://bitbucket.org/atlassian/atlaskit/commits/b69c45f))
## 6.1.7 (2017-11-15)

* bug fix; fix flags within page components appearing behind navigation (issues closed: ak-1823) ([08e397e](https://bitbucket.org/atlassian/atlaskit/commits/08e397e))
## 6.1.6 (2017-11-13)

* bug fix; update flag's react-transition-group dependency from v1 to v2 (issues closed: ak-3755) ([32f3af3](https://bitbucket.org/atlassian/atlaskit/commits/32f3af3))


## 6.1.5 (2017-11-02)

* bug fix; added missing dependencies (issues closed: ak-3782) ([4dbc3ef](https://bitbucket.org/atlassian/atlaskit/commits/4dbc3ef))
## 6.1.4 (2017-10-26)

* bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 6.1.3 (2017-10-22)

* bug fix; update styled component dependency and react peerDep ([39f3286](https://bitbucket.org/atlassian/atlaskit/commits/39f3286))

## 6.1.2 (2017-10-15)


* bug fix; update dependencies for react 16 compatibility ([fc47c94](https://bitbucket.org/atlassian/atlaskit/commits/fc47c94))
## 6.1.1 (2017-10-12)

* bug fix; bumps version of Page (issues closed: ak-3680) ([8713649](https://bitbucket.org/atlassian/atlaskit/commits/8713649))








## 6.1.0 (2017-08-17)

* feature; adding new AutoDismissFlag component (issues closed: ak-2974 ak-1503) ([9aa91c0](https://bitbucket.org/atlassian/atlaskit/commits/9aa91c0))
## 6.0.0 (2017-08-16)

* breaking; The Flag.id prop has been changed from optional to required. ([91f8dc4](https://bitbucket.org/atlassian/atlaskit/commits/91f8dc4))
* breaking; FlagGroup no longer illegally reads Flag.props.key ([91f8dc4](https://bitbucket.org/atlassian/atlaskit/commits/91f8dc4))
## 5.0.1 (2017-08-15)

* bug fix; flag transitions between appearances smoothly, hides expand icon if not needed (issues closed: ak-2973 ak-3155) ([0766202](https://bitbucket.org/atlassian/atlaskit/commits/0766202))
## 5.0.0 (2017-08-11)

* bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))

* breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
* breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))






## 4.0.0 (2017-08-11)

* breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
* breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))






## 3.4.4 (2017-08-04)


* bug fix; moves babel-plugin-react-flow-props-to-prop-types to a devDependency ([6378b88](https://bitbucket.org/atlassian/atlaskit/commits/6378b88))





## 3.4.3 (2017-07-27)


* fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 3.4.2 (2017-07-25)


* fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 3.4.1 (2017-07-19)

## 3.1.0 (2017-07-17)

## 3.1.0 (2017-07-17)

## 3.1.0 (2017-07-17)


* fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 3.1.0 (2017-07-17)


* fix; replace incorrect component description in Flag storybook ([2c42255](https://bitbucket.org/atlassian/atlaskit/commits/2c42255))


* feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 3.0.0 (2017-07-06)


* fix; add TransitionGroup to FlagGroup to handle lifecycle animations ([6dbb237](https://bitbucket.org/atlassian/atlaskit/commits/6dbb237))


* breaking; Removed shouldDismiss prop from Flag. Just set a FlagGroup's children declaratively and animation
will be handled automatically with TransitionGroup (you don't need to wait until the flag has
animated out before updating your state).

ISSUES CLOSED: AK-2558

## 2.2.1 (2017-06-19)


* fix; bump Flag icon dependency to 7.x ([35bb4fa](https://bitbucket.org/atlassian/atlaskit/commits/35bb4fa))

## 2.2.0 (2017-06-05)


* fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))


* feature; added new optional bold flags, controlled by the Flag.appearance prop ([b78dca7](https://bitbucket.org/atlassian/atlaskit/commits/b78dca7))

## 2.1.2 (2017-05-12)


* fix; flag dismiss button focus style and spacing now correct ([c0130be](https://bitbucket.org/atlassian/atlaskit/commits/c0130be))

## 2.1.1 (2017-05-11)


* fix; bump modal-dialog dep, and change to a devDep ([d16f887](https://bitbucket.org/atlassian/atlaskit/commits/d16f887))

## 2.1.0 (2017-05-06)


* feature; allow flags to be dismissed programatically via shouldDismiss prop ([445dcb4](https://bitbucket.org/atlassian/atlaskit/commits/445dcb4))

## 2.0.4 (2017-05-02)


* fix; change to dependency on util-shared-styles to correct version ([a052c60](https://bitbucket.org/atlassian/atlaskit/commits/a052c60))

## 2.0.3 (2017-04-27)


* fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 2.0.2 (2017-04-26)


* fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 2.0.1 (2017-04-13)


* fix; update flag stories to use new readme component ([1c56c84](https://bitbucket.org/atlassian/atlaskit/commits/1c56c84))

## 2.0.0 (2017-04-04)


null refactor the flag component to use styled-components ([615208f](https://bitbucket.org/atlassian/atlaskit/commits/615208f))


* breaking; added peerDependency "styled-components”, removed dependency “classnames”

ISSUES CLOSED: AK-2028

## 1.0.9 (2017-03-23)


* fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 1.0.7 (2017-03-21)

## 1.0.7 (2017-03-21)

## 1.0.6 (2017-03-21)


* fix; accept JSX in description prop ([c986abf](https://bitbucket.org/atlassian/atlaskit/commits/c986abf))
* fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.0.5 (2017-02-27)


* fix; update flag's icon dependency to latest ([e60c12a](https://bitbucket.org/atlassian/atlaskit/commits/e60c12a))

## 1.0.4 (2017-02-20)


* fix; use correctly scoped package names in npm docs ([91dbd2f](https://bitbucket.org/atlassian/atlaskit/commits/91dbd2f))

## 1.0.3 (2017-02-10)


* fix; Dummy commit to release components to registry ([5bac43b](https://bitbucket.org/atlassian/atlaskit/commits/5bac43b))
