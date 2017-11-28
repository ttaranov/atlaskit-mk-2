# @atlaskit/breadcrumbs

## 3.1.1 (2017-11-21)

* bug fix; bumping internal dependencies to the latest major version ([f996668](https://bitbucket.org/atlassian/atlaskit/commits/f996668))
## 3.1.0 (2017-11-03)



* feature; breadcrumbsItem supports a custom component (issues closed: ak-3721) ([14fdedf](https://bitbucket.org/atlassian/atlaskit/commits/14fdedf))
## 3.0.3 (2017-10-31)

* bug fix; update button dep ([069d0f4](https://bitbucket.org/atlassian/atlaskit/commits/069d0f4))
## 3.0.2 (2017-10-26)

* bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))
## 3.0.1 (2017-10-22)

* bug fix; update dependencies for react-16 ([077d1ad](https://bitbucket.org/atlassian/atlaskit/commits/077d1ad))
## 3.0.0 (2017-10-20)





* breaking; By default, breadcrumbs will not truncate unless they are of greater width than the container. ([5b9099c](https://bitbucket.org/atlassian/atlaskit/commits/5b9099c))
* breaking; update breadcrumbs to have setable truncationWidth (issues closed: #ak-3451, #ak-3555) ([5b9099c](https://bitbucket.org/atlassian/atlaskit/commits/5b9099c))
* bug fix; make breadcrumb max-width important (issues closed: #ak-3541) ([e804650](https://bitbucket.org/atlassian/atlaskit/commits/e804650))
## 2.5.2 (2017-09-13)

* bug fix; update breadcrumb dependencies ([784b7ee](https://bitbucket.org/atlassian/atlaskit/commits/784b7ee))


## 2.5.1 (2017-08-21)

* bug fix; fix PropTypes warning ([040d579](https://bitbucket.org/atlassian/atlaskit/commits/040d579))
## 2.5.0 (2017-08-17)



* feature; adds an onClick prop to the BreadcrumbsItem component. (issues closed: ak-3259) ([61fee5a](https://bitbucket.org/atlassian/atlaskit/commits/61fee5a))
## 2.4.3 (2017-08-11)

* bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))








## 2.4.2 (2017-07-27)


* fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 2.4.1 (2017-07-25)


* fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 2.1.0 (2017-07-17)

## 2.1.0 (2017-07-17)

## 2.1.0 (2017-07-17)


* fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 2.1.0 (2017-07-17)


* feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 2.0.2 (2017-05-26)


* fix; fix for empty children have separators ([b01fd7b](https://bitbucket.org/atlassian/atlaskit/commits/b01fd7b))
* fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))

## 2.0.1 (2017-05-25)


* fix; don't render empty children as breadcrumbs ([f68c36d](https://bitbucket.org/atlassian/atlaskit/commits/f68c36d))

## 2.0.0 (2017-05-25)


null refactored breadcrumbs to use styled-components ([c5c31b6](https://bitbucket.org/atlassian/atlaskit/commits/c5c31b6))


* breaking; Now exports default (Breadcrumbs), BreadcrumbsStateless and BreadcrumbsItem, rather than default,
AkBreadcrumbs and AkBreadcrumbsItem

ISSUES CLOSED: AK-2161, AK-2425

## 1.1.3 (2017-05-15)


* fix; pass target prop to Button ([23f0de7](https://bitbucket.org/atlassian/atlaskit/commits/23f0de7))
* fix; testing releasing more than 5 packages at a time ([e69b832](https://bitbucket.org/atlassian/atlaskit/commits/e69b832))

## 1.1.2 (2017-04-27)


* fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 1.1.1 (2017-04-26)


* fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 1.1.0 (2017-04-20)


* feature; removed explicit style! imports, set style-loader in webpack config ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))

## 1.0.8 (2017-04-04)


* fix; adds defensive code to allow testing in mocha/jsdom, re-enables some tests ([a7c1b7a](https://bitbucket.org/atlassian/atlaskit/commits/a7c1b7a))
* fix; fixes breadcrumbs to be able to be testable with mocha and jsdom ([c53d8d0](https://bitbucket.org/atlassian/atlaskit/commits/c53d8d0))

## 1.0.7 (2017-03-23)


* fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 1.0.5 (2017-03-21)

## 1.0.5 (2017-03-21)


* fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.0.4 (2017-03-14)

## 1.0.3 (2017-02-23)


* fix; Removes jsdoc from breadcrumbs ([e8f25fc](https://bitbucket.org/atlassian/atlaskit/commits/e8f25fc))

## 1.0.2 (2017-02-09)


* fix; avoiding binding render to this ([40c9951](https://bitbucket.org/atlassian/atlaskit/commits/40c9951))

## 1.0.1 (2017-02-06)


* fix; Updates package to use ak scoped packages ([f066736](https://bitbucket.org/atlassian/atlaskit/commits/f066736))
