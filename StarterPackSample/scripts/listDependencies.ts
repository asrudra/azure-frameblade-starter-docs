import fs = require('fs');

function traverseAndReportDependencies(dependencies: object, parentDependencyName: string = ''): string[] {

    const results: string[] = [];
    Object.keys(dependencies).forEach((key) => {

        const dependency = dependencies[key];
        const path = parentDependencyName ? parentDependencyName + key : '';
        const version = dependency.version;
        const dev = !!dependency.dev;
        const flagged = !!flaggedDependenciesSet[key + version];

        results.push(`${key},${path},${version},${dev},${flagged}`);
        if (dependency.dependencies) {
            const subDependencies = traverseAndReportDependencies(dependency.dependencies, key + '.');
            results.push(...subDependencies);
        }
    });

    return results;
}

const packageLockFileLocation = './package-lock.json';
const packageLockFileContents =  fs.readFileSync(packageLockFileLocation, 'utf-8');
const packageLockFileObject = JSON.parse(packageLockFileContents);

const flaggedDependenciesFileLocation = './scripts/inputs/flaggedDependencies.json';
const flaggedDependenciesFileContents =  fs.readFileSync(flaggedDependenciesFileLocation, 'utf-8');
const flaggedDependenciesObject = JSON.parse(flaggedDependenciesFileContents);
const flaggedDependenciesSet: object = {};
flaggedDependenciesObject.flaggedDependencies.forEach((element) => {
    flaggedDependenciesSet[element] = 'flagged';
});

const dependencyList = traverseAndReportDependencies(packageLockFileObject.dependencies);
dependencyList.unshift('Name,Path,Version,Dev Dependency,Flagged');
const dependencyListFileLocation = './scripts/outputs/packageDependencies.csv';
fs.writeFileSync(dependencyListFileLocation, dependencyList.join(',\r\n'));
