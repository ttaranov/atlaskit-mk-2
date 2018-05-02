# Definition of done

When contributing, please ensure This definition of done represents the acceptance criteria that are common to every pull request. Everything in this checklist needs to be ticked off before the pull request is merged to the master branch.

## 1. Reviewed
--------------
* Approval by a AK components maintainer

* Code review by a AK components maintainer

* Design review of examples on the AK website (in PR)

* Backwards compatible if API changed

* No regression in core features

## 2. Developed
---------------
### a. Test coverage

Please check [Atlaskit testing documentation](https://atlaskit.atlassian.com/docs/guides/testing)

  *   Static check ( TS or Flow )
  *   Unit test
  *   Integration test
  *   Functional test
  *   Visual Regression
  *   Performance test

### b. Manual testing

  #### I - Browser testing - Latest version

  * Windows
    * Chrome
    * Firefox
    * Edge
    * IE11
  * Mac
    * Chrome
    * Firefox
    * Safari

  #### II - Screen reader testing (Accessibility testing) - when applicable  
  
    
## 3. Documented
----------------

**Dev docs updated - Atlaskit website**

- Provide examples that demonstrate the intended use cases (if applicable)

## 4. Consumable
----------------

Released on npm and published on the [AK website](http://atlaskit.atlassian.com/).

- Version number to reflect the level of API changes, and NOT reflecting design or feature completeness. If unsure Please check [Atlaskit versioning documentation](https://atlaskit.atlassian.com/docs/guides/versioning)
