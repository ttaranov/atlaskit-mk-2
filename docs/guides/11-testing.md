# Testing in atlaskit

We encourage adding tests to all components on **AtlasKit**. 
**Jest** is the testing framework across all types of tests in atlaskit.

## Testing support as of today includes 
### Unit tests
 - write unit test for component using **Jest test framework**.
 - unit tests for packages should be structured under `<pkg>/__tests__` folder.
 - on CI tests are run only against changed packages. 
 - to run unit tests use command `yarn test`.

 ### Browser unit tests
 - some components require unit tests which can be run against real browser.
 - these tests use *jest-karma runner* for running the tests. 
 - browser unit tests for packages should be structured under `<pkg>/tests/browsers`.
 - on CI tests are run only against changed pacakges.
 - tests are run against different browsers on CI .
 - to run browser unit tests on local use command `yarn test:browser`.
 - to run browser unit tests on *browserstack* :
    - set `BROWSERSTACK_USERNAME = <username>`
    - set `BROWSERSTACK_KEY = <userkey>`
    - use command `yarn test:browser:browserstack`

### Browser Webdriver/Integration tests 
 - webdriver tests are used to test actual behavior of component inside of browser on **user interactions**.
 - these tests use **Jest runner** for running the webdriver tests.
 - webdriver tests for packages should be structured under `<pkg>/__tests__/integration`
 - on CI tests are run only against changed packages and if the the pkg has integration tests.
 - to run webdriver tests on local use command `yarn test:webdriver`
 - to run webdriver tests on *browserstack* 
   - set `BROWSERSTACK_USERNAME = <username>`
   - set `BROWSERSTACK_KEY = <userkey>`
   - use command `test:webdriver:browserstack`