import { UserConfig, defineConfig } from "vite";
import path from "path";
import builtins from "builtin-modules";
import react from "@vitejs/plugin-react";
import fs from "fs";

const copyToRoot = () => {
	return {
		name: 'copy-to-root',
		closeBundle() {
			if (fs.existsSync('./dist/main.js')) {
				fs.copyFileSync('./dist/main.js', './main.js');
				console.log('🔄 Hot reload: Copied main.js to root');
			}
			if (fs.existsSync('./dist/styles.css')) {
				fs.copyFileSync('./dist/styles.css', './styles.css');
				console.log('🔄 Hot reload: Copied styles.css to root');
			}
		}
	};
};

export default defineConfig(async ({ mode }) => {
	const { resolve } = path;
	const prod = mode === "production";

	return {
		plugins: [react(), copyToRoot()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		build: {
			lib: {
				entry: resolve(__dirname, "src/main.ts"),
				name: "main",
				fileName: () => "main.js",
				formats: ["cjs"],
			},
			minify: prod,
			sourcemap: prod ? false : "inline",
			outDir: "./dist",
			cssCodeSplit: false,
			emptyOutDir: false,
			rollupOptions: {
				input: {
					main: resolve(__dirname, "src/main.ts"),
				},
				output: {
					entryFileNames: "main.js",
					assetFileNames: "styles.css",
				},
				external: [
					"obsidian",
					"electron",
					"@codemirror/autocomplete",
					"@codemirror/collab",
					"@codemirror/commands",
					"@codemirror/language",
					"@codemirror/lint",
					"@codemirror/search",
					"@codemirror/state",
					"@codemirror/view",
					"@lezer/common",
					"@lezer/highlight",
					"@lezer/lr",
					...builtins,
				],
			},
		},
	} as UserConfig;
});
