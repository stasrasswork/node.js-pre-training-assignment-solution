/** @type {import('jest').Config} */
module.exports = {
  rootDir: '..',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['<rootDir>/tests/node_modules/ts-jest', { tsconfig: '<rootDir>/tests/tsconfig.json' }],
  },
  collectCoverageFrom: [
    'JS-TS/solutions/todo-service.ts',
    'JS-TS/solutions/repository.ts',
  ],
};

