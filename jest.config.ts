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
  ],
};

export default config;
