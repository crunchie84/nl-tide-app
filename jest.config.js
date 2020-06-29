// eslint-disable-next-line no-undef
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@api/(.*)$': '<rootDir>/src/api/$1',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageReporters: ['html'],
};
