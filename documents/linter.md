# Code Linting
The solution utilizes [TSLint](https://palantir.github.io/tslint/) to promote common coding standards and conventions.  

## Dependencies
none

## Development Depedencies
* tslint: 5.11.0
* tslint-loader: 3.6.0
* tslint-origin-ordered-imports-rule: 1.1.2
* tslint-react: 3.6.0

## Configuration
TSLint is managed primarily from the the tslint.json file located in the project's top level folder.  This file's **extends** specifies rules should be applied from two primary sources:

* TSLint default ruleset viewable [here](https://github.com/palantir/tslint/blob/master/src/configs/latest.ts)
* TSLint-React ruleset view able [here](https://github.com/palantir/tslint-react)

The **rulesDirectory** entry additionally instructs TSLint to apply rules from:

* TSLint rules specified by the [tslint-origin-ordered-imports-rule](https://github.com/marcuzy/tslint-origin-ordered-imports-rule)

Additional entries serve to override imported rules or introduce new rules.  Development teams may subsequently tune rules to match their established coding conventions.  Notable entries include:

* **linterOptions.exclude**: specify file glob patterns on which to exclude linting rules.  This rule can useful when importing custom code not matching your team's development specifications.

* **no-implicit-dependencies**: blocks module imports unless explicitly specified in package.json.  If enabled, the rule requires several listed exceptions to enable import of key Redux and Office UI Fabric modules. 

## Build
The webpack is configured to use tslint-loader to check all code against linting rules on prior to execution.  Any code flagged by the linter will subsequently fail the build.  These constraints can be relaxed in **webpack.common.js** by marking **failOnHint** to false.  It is generally recommended not adjust these settings as they defeat the linter's purpose.  

## Overrides and Escapes
Any TSLint rule can be globally overriden by updating tslint.json.  Additionally, developers can escape individual lines by suffixing a comment:

 ```javascript
export let registeredActions: Map<string, (value: any) => void>; // tslint:disable-line: no-any    
```

Escapes should be minimized to exceptional cases.  