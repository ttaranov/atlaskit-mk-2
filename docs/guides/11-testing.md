# Testing in Atlaskit

We encourage adding tests to all components on **Atlaskit**.

**Jest** is the testing framework across all types of tests in Atlaskit.

## Testing support as of today includes 
### Unit tests
- write unit test for component using **Jest test framework**.
- *unit tests* for packages should be structured under `<pkg>/__tests__` folder.
- on CI these are run only against changed packages. 
- run all tests `yarn test`.
- run for changed packages `yarn test:changed`
- single test run `yarn test <path_to_test_file>`

### Browser unit tests
- some components require unit tests which can be run against **real browser**.
- these tests use *jest-karma runner*. 
- *browser unit tests* for packages should be structured under `<pkg>/tests/browser`.
- on local these run against 2 browsers on local (Chrome and FF).
- in CI these run against 5 different browsers across OS on changed packages only. 
- to run on local `yarn test:browser`.
- to run on *browserstack* :
    - set `BROWSERSTACK_USERNAME = <username>`
    - set `BROWSERSTACK_KEY = <userkey>`
    - run all *browser unit test* `yarn test:browser:browserstack`

### Browser Webdriver/Integration tests 
- webdriver tests are used to test actual behavior of component inside of browser on **user interactions**.
- use **Jest runner** for running the webdriver tests.
- *webdriver tests* for packages should be structured under `<pkg>/__tests__/integration`
- on local these run against 3 different browsers on local (Chrome , FF and Safari). 
- on CI these are run against 5 different browsers across OS on changed packages. 
- to run on local use command `yarn test:webdriver`
- to run single test on local use command `yarn test:webriver <path_to_file>`
- to run on *browserstack* 
    - set `BROWSERSTACK_USERNAME = <username>`
    - set `BROWSERSTACK_KEY = <userkey>`
    - run all *webdriver tests* `test:webdriver:browserstack`
    - run single test `yarn test:webriver:browserstack <path_to_file>`