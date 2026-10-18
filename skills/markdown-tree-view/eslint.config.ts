import base, { browser, node, typeChecked } from "@allurx/js-config/eslint";
import { defineConfig } from "eslint/config";

export default defineConfig(
    base,
    {
        files: ["src/**/*.ts", "tests/**/*.ts", "build.ts", "eslint.config.ts"],
        extends: [typeChecked],
        languageOptions: {
            parserOptions: {
                // 浏览器配置单独维护，显式选择两个项目以覆盖各自的文件范围。
                projectService: false,
                project: ["./tsconfig.json", "./tsconfig.browser.json"],
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ["src/**/*.ts", "tests/**/*.ts", "build.ts", "eslint.config.ts"],
        ignores: ["src/view.ts", "src/browser/**"],
        extends: [node],
    },
    { files: ["src/view.ts", "src/browser/**/*.ts"], extends: [browser] }
);
