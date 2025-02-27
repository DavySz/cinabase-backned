import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: "ts-jest",
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/main/**",
    "!src/domain/**",
    "!src/**/protocols/**",
    "!src/**/schemas/**",
    "!src/types/**",
  ],
  moduleNameMapper: {
    "^@domain/(.*)$": "<rootDir>/src/domain/$1",
    "^@infra/(.*)$": "<rootDir>/src/infra/$1",
    "^@main/(.*)$": "<rootDir>/src/main/$1",
    "^@presentation/(.*)$": "<rootDir>/src/presentation/$1",
    "^@test/(.*)$": "<rootDir>/test/$1",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};

export default config;
