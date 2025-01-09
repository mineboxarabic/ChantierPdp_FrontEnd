export default {
    testEnvironment: "jest-environment-jsdom",
    setupFilesAfterEnv: ['<rootDir>/setupTests.ts'], // Include jest-dom setup,
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: ['**/*.test.(ts|tsx)'],

};
