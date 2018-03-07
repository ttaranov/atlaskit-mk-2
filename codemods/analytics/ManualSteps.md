# How to run the codemod

1. Run the codemod to wrap our files with analytics
`yarn run jscodeshift -t codemods/analytics/transforms packages/elements/ --ignore-config .eslintignore`
2. Run the tests codemod to add analytics tests
`yarn run jscodeshift -t codemods/analytics/transforms/tests.js packages/elements/ --ignore-config .eslintignore`
3. Run the `addDeps.js` script to add deps for each package


## TODO:
~~~1. Add mount & shallow import from enzyme for tests~~~
2. Add overwrite functionality for context HOC
3. Lodge & fix bolt bug that occurs when adding multiple packages, possibly with exec?
4. Fix imperative focus ref problem for field-text and field-text-area
~~~5. Fix duplicate 'Select' declaration problem~~~
~~~6. Fix pagination & icon test transforms not working~~~