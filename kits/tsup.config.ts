import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ["src/index.ts"],
	cjsInterop: true,
	tsconfig: "tsconfig.json",
	splitting: true,
	sourcemap: true,
	clean: true,
	dts: true,
	format: ["cjs", "esm", "iife"],
	shims: true,
});
