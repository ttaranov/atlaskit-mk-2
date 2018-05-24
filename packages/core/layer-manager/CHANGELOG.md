# @atlaskit/layer-manager

## 3.0.4
- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/tooltip@9.2.1
  - @atlaskit/onboarding@3.1.3
  - @atlaskit/modal-dialog@4.0.5
  - @atlaskit/analytics-next@2.1.1
  - @atlaskit/button@7.2.5
  - @atlaskit/docs@3.0.4

## 3.0.3

- [patch] Fix race condition in layer manager's portal where portalled contents would still display after unmounting if they were quickly mounted and then unmounted [23ef141](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/23ef141)

## 3.0.2
- [patch] support new property "targetNode" on spotlight component [48397b6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/48397b6)

## 3.0.1
- [patch] AK-4416 changes meaning of autofocus prop values [c831a3d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c831a3d)

## 3.0.0
- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 2.8.3
- [patch] Preserve analytics-next context across portalled contents [69c606b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/69c606b)

## 2.8.2
- [patch] Fix flow type error and bug not calling preventDefault [aac58a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aac58a9)

## 2.8.1
- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 2.8.0
- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 2.7.4
- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 2.7.3
- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 2.7.2
- [patch] Preserve jira context keys through portals for layer manager components [a0705fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a0705fd)

## 2.7.1
- [patch] Fix infinite loop caused by nested layer components (e.g. modals) of the same type [d48686d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d48686d)

## 2.7.0
- [minor] Fixed minor bug in utils/packages added ref to wrappedcomponent of withRenderTarget HoC for better testability [58be62a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/58be62a)

## 2.6.0
- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 2.5.9
- [patch] Update layer manager enabled components to work with analytics [28077f5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/28077f5)

## 2.5.8
- [patch] more robust implementation of FocusLock [64dd1d8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64dd1d8)

## 2.5.7
- [patch] expose portal from layer-manager [d52913b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d52913b)

## 2.5.6
- [patch] update flow dep, fix flow errors  [722ad83](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/722ad83)

## 2.5.5
- [patch] AK-4064 ensure unmountComponentAtNode is called for components rendered via ReactDOM.render [e3153c3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e3153c3)

## 2.5.4

## 2.5.3

## 2.5.2

## 2.5.1

## 2.5.0
- [minor] support context via HOC from layer-manager [333a8de](333a8de)

## 2.4.1

## 2.4.0 (2017-11-14)

* add flow types
* feature; add support for flags ([a451a73](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a451a73))