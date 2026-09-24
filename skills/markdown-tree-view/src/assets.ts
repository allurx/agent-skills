import { readFileSync } from "node:fs";

declare const BUNDLED_CSS: string | undefined;
declare const BUNDLED_JS: string | undefined;
declare const BUNDLED_LICENSE: string | undefined;

export const license =
    typeof BUNDLED_LICENSE === "string"
        ? BUNDLED_LICENSE
        : readFileSync(new URL("../LICENSE.txt", import.meta.url), "utf8")
              .replace(/\r\n?/gu, "\n")
              .trim();

export const css =
    typeof BUNDLED_CSS === "string" ? BUNDLED_CSS : readFileSync(new URL("./view.css", import.meta.url), "utf8");

// Compile once for source execution; packaging replaces this branch with the
// same JavaScript so an installed Skill never needs the development toolchain.
export const script =
    typeof BUNDLED_JS === "string"
        ? BUNDLED_JS
        : (
              await (
                  await import("esbuild")
              ).transform(readFileSync(new URL("./view.ts", import.meta.url), "utf8"), {
                  loader: "ts",
                  format: "iife",
                  target: "es2022",
              })
          ).code;
