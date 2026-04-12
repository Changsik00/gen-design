import StyleDictionary from "style-dictionary";
import { readFileSync } from "fs";

const tokens = JSON.parse(readFileSync(new URL("./tokens.json", import.meta.url), "utf-8"));

// --- 커스텀 포맷: :root { } ---
StyleDictionary.registerFormat({
  name: "css/shadcn-light",
  format: ({ dictionary }) => {
    const vars = dictionary.allTokens
      .map((token) => `  --${token.name}: ${token.$value ?? token.value};`)
      .join("\n");
    return `/* Auto-generated from tokens.json — do not edit */\n:root {\n${vars}\n}\n`;
  },
});

// --- 커스텀 포맷: .dark { } ---
StyleDictionary.registerFormat({
  name: "css/shadcn-dark",
  format: ({ dictionary }) => {
    const vars = dictionary.allTokens
      .map((token) => `  --${token.name}: ${token.$value ?? token.value};`)
      .join("\n");
    return `/* Auto-generated from tokens.json — do not edit */\n.dark {\n${vars}\n}\n`;
  },
});

// --- 토큰 이름 변환: semantic.color.light.primary → primary ---
StyleDictionary.registerTransform({
  name: "name/shadcn",
  type: "name",
  transform: (token) => {
    const parts = token.path;
    if (parts[0] === "semantic" && parts[1] === "color") {
      return parts.slice(3).join("-");
    }
    if (parts[0] === "semantic" && parts[1] === "radius") {
      return parts.slice(2).join("-");
    }
    if (parts[0] === "semantic" && parts[1] === "font") {
      return "font-" + parts.slice(2).join("-");
    }
    return parts.join("-");
  },
});

// --- Light 빌드 ---
const sdLight = new StyleDictionary({
  tokens,
  usesDtcg: true,
  platforms: {
    css: {
      transforms: ["name/shadcn"],
      buildPath: new URL("../src/styles/", import.meta.url).pathname,
      files: [
        {
          destination: "_tokens-light.css",
          format: "css/shadcn-light",
          filter: (token) => {
            const p = token.path;
            return (
              p[0] === "semantic" &&
              (p[2] === "light" || p[1] === "radius" || p[1] === "font")
            );
          },
        },
      ],
    },
  },
});

// --- Dark 빌드 ---
const sdDark = new StyleDictionary({
  tokens,
  usesDtcg: true,
  platforms: {
    css: {
      transforms: ["name/shadcn"],
      buildPath: new URL("../src/styles/", import.meta.url).pathname,
      files: [
        {
          destination: "_tokens-dark.css",
          format: "css/shadcn-dark",
          filter: (token) => {
            const p = token.path;
            return p[0] === "semantic" && p[1] === "color" && p[2] === "dark";
          },
        },
      ],
    },
  },
});

await sdLight.buildAllPlatforms();
await sdDark.buildAllPlatforms();

console.log("✅ 토큰 빌드 완료: src/styles/_tokens-light.css, _tokens-dark.css");
