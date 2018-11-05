# Overview

The Azure Portal FrameBlade Starter Pack provides a working project addressing key [Azure portal](https://azure.microsoft.com/en-us/features/azure-portal/) development concerns:

1. View Development
2. State Management
3. Authentication / Authorization
4. Accessibility
5. Localization
6. Build and Deployment
7. Test
8. Code Linting
9. Browser Compatibility
10. Theming and Styling
11. Open Source Software Management

The project integrates with the Azure portal development framework ([Ibiza](https://github.com/Azure/portaldocs)).  Views can be surfaced through Ibiza [FrameBlades](https://github.com/Azure/portaldocs/blob/master/portal-sdk/generated/top-blades-frameblade.md) or hosted in standalone applications.  Key integration points (e.g. navigation, localization, and themes) are addressed.  And sample code demonstrates how to apply provided capabilities to develop extensions.  The Azure Portal FrameBlade Starter Pack targets development teams seeking to maximize flexibility by adopting the FrameBlade development model.  It encaspulates lessons learned to reduce required engineering to deploy production-grade capabilities.


## Origin and Motivation
The starter pack originates from a successful pilot effort to modernize a portal extension while still complying with governing standards (e.g. security, localization, themes).  Efforts yielded several new production views and repeatable patterns for future development.  The team experienced a net gain in developer satisfaction and code quality.  The effort cost several person-months exploring new technologies, developing patterns, and incorporating lessons learned.  The starter pack assists other teams considering FrameBlade development, helping avoid duplicate engineering costs and common pitfalls.  In this sense, the project is highly opinionated, reflecting the design and technology choices of its creators.  Consumers may subsequently adopt the starter pack to immediately begin developing or modernizing their extension.  Alternatively, they may use it as a test platform exploring variations in an integrated solution.  FrameBlade development traditionally requires substantial up-front investment to yield production capabilities.  The starter pack exists to reduce these initial costs.

## Key Technologies
The project is built around [React](https://reactjs.org/) technologies.  Subsequent choices for control libraries, state management, and test tools flow from the decision.  

* [Office UI Fabric](https://developer.microsoft.com/en-us/fabric) supplies core control components and theming resources.
* [Redux](https://redux.js.org/) and [Redux-Saga](https://github.com/redux-saga/redux-saga) provide state management resources.  
* [Jest](https://jestjs.io/) and [Enzyme](https://github.com/airbnb/enzyme) support test scenarios.
* [i18Next](https://www.i18next.com/) addresses localization.
* [WebPack](https://webpack.js.org/) is used to package the application for deployment.

The library adopts [TypeScript](https://www.typescriptlang.org/) for all code samples and employs [TSLint](https://palantir.github.io/tslint/) as a code linter.  The project is structured as a Node project, using NPM for dependency management.  Provided documentation explores these resources in greater depth.  However, teams may wish to have to some familiarity with these libaries' purpose and functions prior to diving into samples.     

## Essential Tools
Consuming teams must install the following tools to successfully utilize the project:

* [NodeJS](https://nodejs.org/en/): v8.9.4 or greater.
* [NPM](https://www.npmjs.com/): (installed with NodeJS) v5.6.0 or greater.
* [TypeScript](https://www.typescriptlang.org/): v2.9.2. 
 ```
npm install -g typescript@2.9.2 
```

Additionally, the following tools are recommended:

* [Visual Studio Code](https://code.visualstudio.com/)
* Visual Studio Code Extensions
 	* npm (fknop.vscode-npm)
    * TSLint (eg2.tslint)
    * ES6 React/Redux/GraphQL/React-Native snippets (dsznajder.es7-react-js-snippets)