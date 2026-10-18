/*
 * Copyright 2026 allurx
 * SPDX-License-Identifier: Apache-2.0
 */

import base, { browser, node, typeChecked } from "@allurx/js-config/eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig(
    globalIgnores(["dist/", "work/"]),
    base,
    {
        files: ["**/*.ts"],
        extends: [typeChecked],
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ["**/*.ts"],
        ignores: ["src/view.ts", "src/browser/**"],
        extends: [node],
    },
    { files: ["src/view.ts", "src/browser/**/*.ts"], extends: [browser] }
);
