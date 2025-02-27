import { DotenvConfigOptions } from "dotenv";

export const getEnvironmentConfig = (
  commands: string[]
): DotenvConfigOptions => {
  return {
    path: `.env.${getEnvironment(commands)}`,
  };
};

const getEnvironment = (commands: string[]): string => {
  const env = commands.find((command) => command.startsWith("--env="));
  return env?.replace("--env=", "") || "development";
};
