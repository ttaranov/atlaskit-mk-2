# @atlaskit/modal-dialog

## 3.2.4 (2017-11-30)



* bug fix; fix modal dialog not shrinking to viewport height in IE11 (issues closed: ak-3879) ([d3bb5cd](https://bitbucket.org/atlassian/atlaskit/commits/d3bb5cd))
## 3.2.3 (2017-11-30)

* bug fix; release stories with fixed console errors ([3321c2b](https://bitbucket.org/atlassian/atlaskit/commits/3321c2b))

## 3.2.2 (2017-11-17)

* bug fix; bumping internal dependencies to latest major version ([3aefbce](https://bitbucket.org/atlassian/atlaskit/commits/3aefbce))

## 3.2.1 (2017-11-13)

* bug fix; remove chrome from the wrapping dialog (issues closed: #67) ([21f3a0e](https://bitbucket.org/atlassian/atlaskit/commits/21f3a0e))
## 3.2.0 (2017-10-26)

* bug fix; add deprecation warning to spotlight package ([3ea2312](https://bitbucket.org/atlassian/atlaskit/commits/3ea2312))
* feature; cleanup layer-manager and modal-dialog in preparation for onboarding ([02a516b](https://bitbucket.org/atlassian/atlaskit/commits/02a516b))
## 3.1.3 (2017-10-26)

* bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))
## 3.1.2 (2017-10-22)

* bug fix; update styled-components dep and react peerDep ([6a67bf8](https://bitbucket.org/atlassian/atlaskit/commits/6a67bf8))
## 3.1.1 (2017-10-12)

* bug fix; bumps version of Page (issues closed: ak-3680) ([8713649](https://bitbucket.org/atlassian/atlaskit/commits/8713649))
## 3.1.0 (2017-10-11)



* feature; add chromeless option to modal to support Connect JSAPI ([5ca6a65](https://bitbucket.org/atlassian/atlaskit/commits/5ca6a65))
## 3.0.2 (2017-10-05)

* bug fix; resolve error in modal dialog (issues closed: ak-3623) ([2052679](https://bitbucket.org/atlassian/atlaskit/commits/2052679))
## 3.0.1 (2017-09-26)

* bug fix; update webpack raw path (issues closed: ak-3589) ([0aa9737](https://bitbucket.org/atlassian/atlaskit/commits/0aa9737))
## 3.0.0 (2017-09-13)




* breaking; onDialogDismissed = onClose, isOpen prop removed, just render the modal to display it ([3819bac](https://bitbucket.org/atlassian/atlaskit/commits/3819bac))
* breaking; major overhaul to modal implementation and behaviour (issues closed: ak-2972, ak-3343) ([3819bac](https://bitbucket.org/atlassian/atlaskit/commits/3819bac))


## 2.6.0 (2017-08-07)

* feature; Added support for custom modal heights, with the new `ModalDialog.height` prop. It accepts a number (converted to `px`) or string (not converted to `px`, so you can use any unit you like such as `%`, `vh`, etc). (issues closed: ak-1723) ([3c1f537](https://bitbucket.org/atlassian/atlaskit/commits/3c1f537))

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

## 2.1.2 (2017-06-15)


* fix; avoid unwanted re-render of modal children when state/props change ([7ae6324](https://bitbucket.org/atlassian/atlaskit/commits/7ae6324))

## 2.1.1 (2017-05-26)


* fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
* fix; pin react-lorem-component version to avoid newly released broken version ([6f3d9c6](https://bitbucket.org/atlassian/atlaskit/commits/6f3d9c6))

## 2.1.0 (2017-05-06)


* feature; animated entry/exit of modal dialog ([e721aaa](https://bitbucket.org/atlassian/atlaskit/commits/e721aaa))

## 2.0.0 (2017-05-05)


null switch modal styling to styled-components ([f9510b4](https://bitbucket.org/atlassian/atlaskit/commits/f9510b4))


* breaking; Modal dialog now has a peerDependency on the styled-components package.

ISSUES CLOSED: AK-2290

## 1.3.3 (2017-05-03)


* fix; Fix child position:fixed elements being clipped ([fc0a894](https://bitbucket.org/atlassian/atlaskit/commits/fc0a894))

## 1.3.2 (2017-04-27)


* fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 1.3.1 (2017-04-26)


* fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 1.3.0 (2017-04-20)


* feature; removed explicit style! imports, set style-loader in webpack config ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))

## 1.2.15 (2017-03-31)


* fix; update modal story to use latest navigation devDep ([5ed9946](https://bitbucket.org/atlassian/atlaskit/commits/5ed9946))
* fix; update modal story to use latest navigation devDep ([c074080](https://bitbucket.org/atlassian/atlaskit/commits/c074080))

## 1.2.14 (2017-03-29)


* fix; only show scrolling keylines when header or footer shown ([fd1c68a](https://bitbucket.org/atlassian/atlaskit/commits/fd1c68a))

## 1.2.13 (2017-03-29)


* fix; fire onDialogDismissed when clicking on blanket directly below modal ([1c9efb0](https://bitbucket.org/atlassian/atlaskit/commits/1c9efb0))

## 1.2.12 (2017-03-23)

## 1.2.10 (2017-03-21)

## 1.2.10 (2017-03-21)


* fix; render rounded corners correctly when header/footer omitted ([724480d](https://bitbucket.org/atlassian/atlaskit/commits/724480d))
* fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.2.9 (2017-02-28)


* fix; dummy commit to release stories ([3df5d9f](https://bitbucket.org/atlassian/atlaskit/commits/3df5d9f))

## 1.2.7 (2017-02-28)


* fix; dummy commit to fix broken stories and missing registry pages ([a31e92a](https://bitbucket.org/atlassian/atlaskit/commits/a31e92a))

## 1.2.7 (2017-02-28)


* fix; dummy commit to release stories for components ([a105c02](https://bitbucket.org/atlassian/atlaskit/commits/a105c02))

## 1.2.6 (2017-02-28)


* fix; removes jsdoc annotations and moves content to usage.md ([14f941a](https://bitbucket.org/atlassian/atlaskit/commits/14f941a))

## 1.2.5 (2017-02-27)


* empty commit to make components release themselves ([5511fbe](https://bitbucket.org/atlassian/atlaskit/commits/5511fbe))

## 1.2.4 (2017-02-13)


* Fix types for modal-dialog typescript declaration file ([533adea](https://bitbucket.org/atlassian/atlaskit/commits/533adea))

## 1.2.3 (2017-02-08)


* fix; trigger modal close handler on esc key in older browsers ([a692683](https://bitbucket.org/atlassian/atlaskit/commits/a692683))

## 1.2.2 (2017-02-07)


* fix; render dropdown in modal above footer ([2b76812](https://bitbucket.org/atlassian/atlaskit/commits/2b76812))

## 1.2.1 (2017-02-06)


* fix; layer navigation at correct level so it works with modal ([5bef9db](https://bitbucket.org/atlassian/atlaskit/commits/5bef9db))
