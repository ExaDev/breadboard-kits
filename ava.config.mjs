/**
 * @type {import('ava').Config}
 */
const config = {
  extensions: {
    ts: "module",
  },
  files: ["tests/**/*.ava.ts"],
  nodeArguments: ["--import=tsx"],
  workerThreads: false,
};

export default config;
