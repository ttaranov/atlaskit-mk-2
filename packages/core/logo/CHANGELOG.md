# @atlaskit/logo

## 7.0.1
- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/field-radio-group@2.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/docs@3.0.4

## 7.0.0
- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 6.2.2

- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 6.2.1
- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 6.2.0
- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 6.1.2
- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 6.1.1
- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 6.1.0
- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 6.0.9

## 6.0.8

## 6.0.7
- [patch] Fix inherited color logo gradient changes not working in chrome [694c59f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/694c59f)

## 6.0.6

## 6.0.5

## 6.0.4

## 6.0.3
- [patch] Logo component gradients no work in Firefox and Safari [6d1f521](6d1f521)

## 6.0.2

## 6.0.0 (2017-11-09)

* breaking; Removed the collapseTo prop in favour of explicit named exports (see below).
* breaking; The default export has been removed in favour of named exports. The named exports are now: AtlassianLogo, AtlassianIcon, AtlassianWordmark, BitbucketLogo, BitbucketIcon, BitbucketWordmark, ConfluenceLogo, ConfluenceIcon, ConfluenceWordmark, HipchatLogo, HipchatIcon, HipchatWordmark, JiraCoreLogo, JiraCoreIcon, JiraCoreWordmark, JiraLogo, JiraIcon, JiraWordmark, StatuspageLogo, StatuspageIcon, StatuspageWordmark, StrideLogo, StrideIcon, StrideWordmark.

## 5.0.0 (2017-10-27)

* bug fix; fixed logo width issue in IE11. ([0ce8ab7](https://bitbucket.org/atlassian/atlaskit/commits/0ce8ab7))
* breaking; Logo sizes changed, children no longer accepted ([7173d81](https://bitbucket.org/atlassian/atlaskit/commits/7173d81))
* breaking; refactoring Logo component to fix numerous bugs ([7173d81](https://bitbucket.org/atlassian/atlaskit/commits/7173d81))

## 4.0.3 (2017-10-26)

* bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 4.0.2 (2017-10-22)

* bug fix; update styled-components dep and react peerDep ([6a67bf8](https://bitbucket.org/atlassian/atlaskit/commits/6a67bf8))

## 4.0.1 (2017-09-14)

* bug fix; jSD and Statuspage logo icons have fixed gradients (issues closed: ak-3479) ([60d8aca](https://bitbucket.org/atlassian/atlaskit/commits/60d8aca))

## 4.0.0 (2017-09-11)

* breaking; All logos have been updated with new assets, please test these inside your application to make sure ([c4db7fc](https://bitbucket.org/atlassian/atlaskit/commits/c4db7fc))
* breaking; new and updated company and product logos ([c4db7fc](https://bitbucket.org/atlassian/atlaskit/commits/c4db7fc))

## 3.5.3 (2017-08-11)

* bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))

## 3.5.2 (2017-07-27)

* fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 3.5.1 (2017-07-25)

* fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 3.2.0 (2017-07-17)

* fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 3.2.0 (2017-07-17)

* feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 3.1.0 (2017-06-08)

* fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))

* feature; Convert logo to styled-components updated internal structure ([ec91404](https://bitbucket.org/atlassian/atlaskit/commits/ec91404))

## 3.0.6 (2017-04-27)

* fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 3.0.5 (2017-04-26)

* fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 3.0.4 (2017-04-18)

* fix; update logo readme to use new readme component ([491d789](https://bitbucket.org/atlassian/atlaskit/commits/491d789))

## 3.0.3 (2017-03-23)

* fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 3.0.1 (2017-03-21)

* fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 3.0.0 (2017-03-06)

* feature; text-only logo mode without icon ([b989245](https://bitbucket.org/atlassian/atlaskit/commits/b989245))

* breaking; isCollapsed prop has been replaced with an optional collapseTo prop (accepts value of 'icon' or 'type')

ISSUES CLOSED: AK-1408

## 2.0.1 (2017-02-09)

* fix; avoiding binding render to this ([40c9951](https://bitbucket.org/atlassian/atlaskit/commits/40c9951))

## 1.0.0 (2017-02-06)

* fix; fix logo to have public access ([5a41e37](https://bitbucket.org/atlassian/atlaskit/commits/5a41e37))

## 1.0.0 (2017-02-06)

* feature; Add more product logos ([e84ae80](https://bitbucket.org/atlassian/atlaskit/commits/e84ae80))
* feature; Adjust width of collapsed logo ([99fa4a5](https://bitbucket.org/atlassian/atlaskit/commits/99fa4a5))
