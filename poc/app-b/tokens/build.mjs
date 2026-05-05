import StyleDictionary from "style-dictionary";
import { readFileSync } from "fs";

const tokens = JSON.parse(
  readFileSync(new URL("../tokens.json", import.meta.url), "utf-8")
);

StyleDictionary.registerFormat({
  name: "css/app-b-light",
  format: ({ dictionary }) => {
    const vars = dictionary.allTokens
      .map((token) => `  --${token.name}: ${token.$value ?? token.value};`)
      .join("\n");
    return `/* Auto-generated from poc/app-b/tokens.json — do not edit */\n:root {\n${vars}\n}\n`;
  },
});

StyleDictionary.registerTransform({
  name: "name/app-b",
  type: "name",
  transform: (token) => {
    const parts = token.path;
    if (parts[0] === "semantic" && parts[1] === "color") {
      return parts.slice(3).join("-");
    }
    if (parts[0] === "semantic" && parts[1] === "radius") {
      return parts.slice(2).join("-");
    }
    if (parts[0] === "semantic" && parts[1] === "spacing") {
      return "space-" + parts.slice(2).join("-");
    }
    if (parts[0] === "semantic" && parts[1] === "font") {
      return "font-" + parts.slice(2).join("-");
    }
    if (parts[0] === "semantic" && parts[1] === "elevation") {
      return "elevation-" + parts.slice(2).join("-");
    }
    return parts.join("-");
  },
});

const sd = new StyleDictionary({
  tokens,
  usesDtcg: true,
  platforms: {
    css: {
      transforms: ["name/app-b"],
      buildPath: new URL("../src/styles/", import.meta.url).pathname,
      files: [
        {
          destination: "_tokens.css",
          format: "css/app-b-light",
          filter: (token) => token.path[0] === "semantic",
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();

console.log("✅ app-b 토큰 빌드 완료: src/styles/_tokens.css");
