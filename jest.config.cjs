module.exports = {
  transform: { "^.+\\.tsx?$": "ts-jest" },
  moduleNameMapper: {
    "^@src/(.*)": "<rootDir>/src/$1",
    "^src/(.*)": "<rootDir>/src/$1",
  },
  testMatch: ["<rootDir>/src/**/*.test.(ts|tsx)"],
  testEnvironment: "node",
  maxConcurrency: 1,
  resetMocks: true,
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": { isolatedModules: true, useESM: true }
  }
};
