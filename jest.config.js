const { resolve } = require('path');

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.steps.ts', '**/*.test.ts'],
    collectCoverageFrom: ['src/**/*.ts'],
    moduleNameMapper: {
        '^@application/(.*)$': resolve(__dirname, './src/application/$1'),
        '^@domain/(.*)$': resolve(__dirname, './src/domain/$1'),
        '^@infrastructure/(.*)$': resolve(__dirname, './src/infrastructure/$1'),
        '^@configuration/(.*)$': resolve(__dirname, './src/configuration/$1'),
        '^@configuration': resolve(__dirname, './src/configuration/index'),
        '^@util': resolve(__dirname, './src/util/index'),
    },
};
