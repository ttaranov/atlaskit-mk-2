# How to run the codemod

1. Run the codemod to wrap our files with analytics
`yarn run jscodeshift -t codemods/analytics packages/elements/ --ignore-config .eslintignore`
2. Run the tests codemod to add analytics tests
`yarn run jscodeshift -t codemods/analytics/tests.js packages/elements/ --ignore-config .eslintignore`
3. Run the `addDeps.js` script to add deps for each package
