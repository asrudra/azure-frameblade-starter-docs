var builder = require('jest-trx-results-processor');

var processor = builder({
    outputFile: 'jest-test-results.trx'
});

module.exports = processor;
